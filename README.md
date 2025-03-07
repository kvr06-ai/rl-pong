# RL-Pong: Interactive Reinforcement Learning Pong Game

![RL-Pong Game](https://img.shields.io/badge/Game-Pong-green)
![Reinforcement Learning](https://img.shields.io/badge/AI-Reinforcement%20Learning-blue)
![TensorFlow.js](https://img.shields.io/badge/Framework-TensorFlow.js-orange)
![React](https://img.shields.io/badge/Frontend-React-61dafb)

An interactive web application that demonstrates reinforcement learning principles using the classic Pong game. Play against an AI paddle that learns in real-time while adjusting hyperparameters to see how they affect the learning process.

## Overview

RL-Pong allows users to:
- Play the classic Pong game against an AI opponent
- Watch and interact with a reinforcement learning agent as it improves over time
- Adjust hyperparameters in real-time and observe their effects on the AI's learning
- Learn about reinforcement learning concepts through an interactive experience

## Features

- **Classic Pong Gameplay**: Control your paddle with arrow keys and compete against the AI
- **Deep Q-Learning Implementation**: AI uses a neural network to learn optimal strategies
- **Interactive Hyperparameter Adjustment**: Modify learning parameters in real-time
- **Educational Resources**: Built-in explanations of RL concepts and parameters
- **Game Controls**: Pause, resume, and reset functionality
- **Responsive Design**: Works on desktop and mobile devices

## Installation and Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation Steps
1. Clone the repository
   ```bash
   git clone <repository-url>
   cd rl-pong
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm start
   ```

4. Open your browser and navigate to
   ```
   http://localhost:3000
   ```

### Build for Production
To create a production build:
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## How to Play

1. **Controls**:
   - Use the **Up Arrow** and **Down Arrow** keys to move your paddle
   - Use the **Reset Game** button to start a new game
   - Use the **Pause/Resume** button to control gameplay

2. **Scoring**:
   - Score points when the AI misses the ball
   - First player to reach 11 points wins

3. **Training the AI**:
   - Toggle the **Start Training** button to enable or disable AI learning
   - Adjust hyperparameters to see how they affect learning:
     - **Exploration Rate (ε)**: Controls randomness in AI actions
     - **Learning Rate (α)**: Controls how quickly the AI adapts
     - **Discount Factor (γ)**: Controls preference for immediate vs. future rewards
     - **Training Speed**: Controls how many training iterations per frame

## Reinforcement Learning Implementation

### Deep Q-Learning Architecture
RL-Pong uses Deep Q-Learning (DQN) with the following components:

- **Neural Network**: A three-layer network (input, 2 hidden, output)
  - Input: Game state (ball position, velocity, paddle positions)
  - Output: Q-values for actions (move up, stay, move down)

- **Experience Replay**: Stores past experiences for efficient learning
  
- **Reward Structure**:
  - +10 for successfully returning the ball
  - +20 for scoring against the player
  - -1 when the player returns the ball
  - -20 when the AI misses (player scores)

### Hyperparameters

- **Exploration Rate (ε)**: 
  - Range: 0.01 (highly exploitative) to 1.0 (highly exploratory)
  - Controls the probability of taking a random action vs. the currently believed best action
  - Higher values encourage exploration of new strategies

- **Learning Rate (α)**:
  - Range: 0.0001 to 0.01
  - Controls how quickly new information overrides old information
  - Too high: Unstable learning; Too low: Slow learning

- **Discount Factor (γ)**:
  - Range: 0.5 to 0.99
  - Controls the importance of future rewards vs. immediate rewards
  - Higher values make the AI more forward-thinking

- **Training Speed**:
  - Range: 1x to 5x
  - Controls how many training iterations per game frame
  - Higher values accelerate learning but consume more computational resources

## Project Structure

```
rl-pong/
├── src/
│   ├── components/           # React components
│   │   ├── Game.tsx          # Main game canvas and logic
│   │   ├── ControlPanel.tsx  # Hyperparameter controls
│   │   ├── Header.tsx        # Application header
│   │   └── RLInfoPanel.tsx   # Educational information panel
│   ├── models/
│   │   └── DQNAgent.ts       # Deep Q-Learning implementation
│   ├── App.tsx               # Main application component
│   └── index.tsx             # Entry point
├── public/
│   └── index.html            # HTML template
├── dist/                     # Production build output
├── package.json              # Dependencies and scripts
├── webpack.config.js         # Webpack configuration
├── tsconfig.json             # TypeScript configuration
└── README.md                 # Project documentation
```

## Technologies Used

- **TensorFlow.js**: In-browser neural network implementation
- **React**: User interface and component architecture
- **TypeScript**: Type-safe JavaScript for better development experience
- **TailwindCSS**: Utility-first CSS framework for styling
- **Webpack**: Module bundling and development server
- **HTML5 Canvas**: Game rendering

## How Reinforcement Learning Works in This Game

1. **State Representation**:
   - The AI receives the current game state (ball position, velocity, paddle positions)

2. **Action Selection**:
   - Based on the state, the AI chooses an action (move up, stay, or move down)
   - This choice balances exploration (trying new actions) vs. exploitation (choosing actions believed to be optimal)

3. **Reward Calculation**:
   - The AI receives rewards based on its performance (returning the ball, scoring, etc.)

4. **Learning Process**:
   - The AI updates its neural network to better predict the value of actions in different states
   - It uses the Bellman equation to update Q-values: Q(s,a) = r + γ * max(Q(s',a'))
   - Experience replay helps the AI learn efficiently from past experiences

5. **Adaptation**:
   - Over time, the AI improves its strategy to maximize cumulative rewards

## Future Enhancements

Potential areas for improvement and expansion:

- **Learning Visualization**: Add real-time graphs showing learning progress
- **Model Saving/Loading**: Allow saving and loading of trained models
- **Multiple AI Algorithms**: Compare different RL approaches (Policy Gradient, Actor-Critic, etc.)
- **Customizable Game Settings**: Allow adjustment of game physics and difficulty
- **Multiplayer Mode**: Allow two human players to compete

## Resources and Further Reading

- [Reinforcement Learning: An Introduction](http://incompleteideas.net/book/the-book-2nd.html) by Sutton & Barto
- [Deep Q-Learning Paper](https://arxiv.org/abs/1312.5602) - Original DQN paper
- [TensorFlow.js Documentation](https://js.tensorflow.org/api/latest/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created as an educational tool to help understand reinforcement learning concepts
- Inspired by classic Pong gameplay and modern RL techniques 