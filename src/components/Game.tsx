import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DQNAgent, GameState, Action, Hyperparams } from '../models/DQNAgent';

interface GameProps {
  hyperparams: Hyperparams;
  isTraining: boolean;
}

const WINNING_SCORE = 11;

const Game: React.FC<GameProps> = ({ hyperparams, isTraining }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [agent, setAgent] = useState<DQNAgent | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);
  
  // Constants
  const CANVAS_WIDTH = 600;
  const CANVAS_HEIGHT = 400;
  const PADDLE_WIDTH = 10;
  const PADDLE_HEIGHT = 60;
  const BALL_SIZE = 10;
  const PADDLE_SPEED = 6;
  const INITIAL_BALL_SPEED = 5;
  
  // Initialize game state
  const [gameState, setGameState] = useState<GameState>({
    ballX: CANVAS_WIDTH / 2,
    ballY: CANVAS_HEIGHT / 2,
    ballVelX: INITIAL_BALL_SPEED,
    ballVelY: INITIAL_BALL_SPEED,
    paddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    aiPaddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
  });
  
  // Key state for player control
  const [keys, setKeys] = useState({
    up: false,
    down: false
  });
  
  const resetGame = useCallback(() => {
    setScore({ player: 0, ai: 0 });
    setGameState({
      ballX: CANVAS_WIDTH / 2,
      ballY: CANVAS_HEIGHT / 2,
      ballVelX: INITIAL_BALL_SPEED,
      ballVelY: INITIAL_BALL_SPEED,
      paddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      aiPaddleY: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2
    });
    setGameOver(false);
    setWinner(null);
  }, [CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_HEIGHT, INITIAL_BALL_SPEED]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };
  
  // Initialize the DQN agent
  useEffect(() => {
    if (!agent) {
      const newAgent = new DQNAgent(hyperparams);
      setAgent(newAgent);
    } else {
      agent.updateHyperparams(hyperparams);
    }
  }, [hyperparams]);
  
  // Set up key listeners for player paddle control
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setKeys(prev => ({ ...prev, up: true }));
      } else if (e.key === 'ArrowDown') {
        setKeys(prev => ({ ...prev, down: true }));
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        setKeys(prev => ({ ...prev, up: false }));
      } else if (e.key === 'ArrowDown') {
        setKeys(prev => ({ ...prev, down: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Check for game over
  useEffect(() => {
    if (score.player >= WINNING_SCORE) {
      setGameOver(true);
      setWinner('player');
    } else if (score.ai >= WINNING_SCORE) {
      setGameOver(true);
      setWinner('ai');
    }
  }, [score]);
  
  // Main game loop
  useEffect(() => {
    if (!canvasRef.current || !agent || isPaused) return;
    
    let animationFrameId: number;
    let lastTime = 0;
    const fps = 60;
    const interval = 1000 / fps;
    
    // Initialize game state and get canvas context
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    // Game loop
    const render = (time: number) => {
      // Throttle fps
      if (time - lastTime < interval) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      lastTime = time;
      
      // If game over, don't update game state
      if (gameOver) {
        // Draw game over screen
        drawGameOver(ctx);
        animationFrameId = requestAnimationFrame(render);
        return;
      }
      
      // Clear canvas
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Update player paddle position based on keys
      let newPaddleY = gameState.paddleY;
      if (keys.up) {
        newPaddleY = Math.max(0, gameState.paddleY - PADDLE_SPEED);
      }
      if (keys.down) {
        newPaddleY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, gameState.paddleY + PADDLE_SPEED);
      }
      
      // Store current state before updating
      const currentState = { ...gameState, paddleY: newPaddleY };
      
      // Get AI action from agent
      let newAiPaddleY = gameState.aiPaddleY;
      let aiAction = Action.STAY;
      
      if (isTraining) {
        aiAction = agent.chooseAction(currentState);
        
        switch(aiAction) {
          case Action.UP:
            newAiPaddleY = Math.max(0, gameState.aiPaddleY - PADDLE_SPEED);
            break;
          case Action.DOWN:
            newAiPaddleY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, gameState.aiPaddleY + PADDLE_SPEED);
            break;
          default:
            // STAY - do nothing
            break;
        }
      } else {
        // Simple AI when not training - track the ball
        const paddleCenter = gameState.aiPaddleY + PADDLE_HEIGHT / 2;
        if (gameState.ballY < paddleCenter - 10) {
          newAiPaddleY = Math.max(0, gameState.aiPaddleY - PADDLE_SPEED / 2);
        } else if (gameState.ballY > paddleCenter + 10) {
          newAiPaddleY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, gameState.aiPaddleY + PADDLE_SPEED / 2);
        }
      }
      
      // Update ball position
      let newBallX = gameState.ballX + gameState.ballVelX;
      let newBallY = gameState.ballY + gameState.ballVelY;
      let newBallVelX = gameState.ballVelX;
      let newBallVelY = gameState.ballVelY;
      
      // Ball collision with top and bottom walls
      if (newBallY <= 0 || newBallY >= CANVAS_HEIGHT - BALL_SIZE) {
        newBallVelY = -newBallVelY;
        newBallY = Math.max(0, Math.min(CANVAS_HEIGHT - BALL_SIZE, newBallY));
      }
      
      // Rewards for the AI
      let reward = 0;
      let done = false;
      
      // Ball collision with paddles
      // Player's paddle (left)
      if (
        newBallX <= PADDLE_WIDTH &&
        newBallY + BALL_SIZE >= newPaddleY &&
        newBallY <= newPaddleY + PADDLE_HEIGHT &&
        newBallVelX < 0
      ) {
        // Ball hits player paddle
        newBallVelX = -newBallVelX;
        
        // Add a bit of randomness to ball direction
        const hitPosition = (newBallY - newPaddleY) / PADDLE_HEIGHT;
        newBallVelY = INITIAL_BALL_SPEED * (2 * hitPosition - 1);
        
        // AI gets negative reward when player returns the ball
        reward = -1;
      }
      
      // AI's paddle (right)
      if (
        newBallX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        newBallY + BALL_SIZE >= newAiPaddleY &&
        newBallY <= newAiPaddleY + PADDLE_HEIGHT &&
        newBallVelX > 0
      ) {
        // Ball hits AI paddle
        newBallVelX = -newBallVelX;
        
        // Add a bit of randomness to ball direction
        const hitPosition = (newBallY - newAiPaddleY) / PADDLE_HEIGHT;
        newBallVelY = INITIAL_BALL_SPEED * (2 * hitPosition - 1);
        
        // AI gets positive reward for returning the ball
        reward = 10;
      }
      
      // Ball out of bounds (scoring)
      if (newBallX <= 0) {
        // AI scores
        setScore(prev => {
          const newScore = { ...prev, ai: prev.ai + 1 };
          return newScore;
        });
        reward = 20; // AI gets a big reward for scoring
        done = true;
        
        // Reset ball
        newBallX = CANVAS_WIDTH / 2;
        newBallY = CANVAS_HEIGHT / 2;
        newBallVelX = INITIAL_BALL_SPEED;
        newBallVelY = (Math.random() * 2 - 1) * INITIAL_BALL_SPEED;
      } else if (newBallX >= CANVAS_WIDTH) {
        // Player scores
        setScore(prev => {
          const newScore = { ...prev, player: prev.player + 1 };
          return newScore;
        });
        reward = -20; // AI gets a big penalty when it misses
        done = true;
        
        // Reset ball
        newBallX = CANVAS_WIDTH / 2;
        newBallY = CANVAS_HEIGHT / 2;
        newBallVelX = -INITIAL_BALL_SPEED;
        newBallVelY = (Math.random() * 2 - 1) * INITIAL_BALL_SPEED;
      }
      
      // Update game state
      const nextState: GameState = {
        ballX: newBallX,
        ballY: newBallY,
        ballVelX: newBallVelX,
        ballVelY: newBallVelY,
        paddleY: newPaddleY,
        aiPaddleY: newAiPaddleY
      };
      
      setGameState(nextState);
      
      // Remember experience and train the agent if in training mode
      if (isTraining) {
        agent.remember(currentState, aiAction, reward, nextState, done);
        
        // Multiple training updates based on training speed
        for (let i = 0; i < hyperparams.trainingSpeed; i++) {
          agent.replay();
        }
      }
      
      // Draw everything
      drawGame(ctx, nextState, score, isTraining);
      
      // Continue animation loop
      animationFrameId = requestAnimationFrame(render);
    };
    
    // Draw game function
    const drawGame = (ctx: CanvasRenderingContext2D, state: GameState, score: { player: number, ai: number }, isTraining: boolean) => {
      // Background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Center line
      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.strokeStyle = '#444';
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Score
      ctx.font = '32px Arial';
      ctx.fillStyle = '#666';
      ctx.textAlign = 'center';
      ctx.fillText(score.player.toString(), CANVAS_WIDTH / 4, 50);
      ctx.fillText(score.ai.toString(), (CANVAS_WIDTH / 4) * 3, 50);
      
      // Player paddle
      ctx.fillStyle = '#4CAF50';
      ctx.fillRect(0, state.paddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      // AI paddle
      ctx.fillStyle = isTraining ? '#FF9800' : '#2196F3';
      ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, state.aiPaddleY, PADDLE_WIDTH, PADDLE_HEIGHT);
      
      // Ball
      ctx.fillStyle = '#fff';
      ctx.fillRect(state.ballX, state.ballY, BALL_SIZE, BALL_SIZE);
      
      // Training indicator
      if (isTraining) {
        ctx.fillStyle = '#FF9800';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('AI TRAINING', CANVAS_WIDTH / 2, 20);
      }
    };

    // Draw game over screen
    const drawGameOver = (ctx: CanvasRenderingContext2D) => {
      // Background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      
      // Game over text
      ctx.font = 'bold 48px Arial';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 50);
      
      // Winner text
      ctx.font = 'bold 32px Arial';
      ctx.fillStyle = winner === 'player' ? '#4CAF50' : '#FF9800';
      ctx.fillText(
        `${winner === 'player' ? 'YOU WIN!' : 'AI WINS!'}`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2
      );
      
      // Score
      ctx.font = '24px Arial';
      ctx.fillStyle = '#fff';
      ctx.fillText(
        `Final Score: ${score.player} - ${score.ai}`,
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 50
      );
      
      // Play again instruction
      ctx.font = '18px Arial';
      ctx.fillStyle = '#aaa';
      ctx.fillText(
        'Press the Reset button to play again',
        CANVAS_WIDTH / 2,
        CANVAS_HEIGHT / 2 + 100
      );
    };
    
    animationFrameId = requestAnimationFrame(render);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameState, keys, agent, isTraining, hyperparams, isPaused, gameOver, winner, score]);
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_WIDTH} 
        height={CANVAS_HEIGHT}
        className="border border-gray-700 rounded-lg shadow-lg bg-gray-900"
      />
      <div className="flex justify-between mt-4">
        <div className="flex gap-2">
          <button 
            onClick={resetGame} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Reset Game
          </button>
          <button 
            onClick={togglePause} 
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>
        <div className="text-center text-lg">
          <p>Use <span className="px-2 py-1 bg-gray-800 rounded">↑</span> and <span className="px-2 py-1 bg-gray-800 rounded">↓</span> arrow keys to control your paddle</p>
          <p className="text-sm text-gray-400 mt-1">First to {WINNING_SCORE} points wins!</p>
        </div>
      </div>
    </div>
  );
};

export default Game; 