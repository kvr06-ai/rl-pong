import * as tf from '@tensorflow/tfjs';

// Define types for state and actions
export interface GameState {
  ballX: number;
  ballY: number;
  ballVelX: number;
  ballVelY: number;
  paddleY: number;
  aiPaddleY: number;
}

export enum Action {
  UP = 0,
  STAY = 1,
  DOWN = 2,
}

export interface Hyperparams {
  epsilon: number;
  alpha: number;
  gamma: number;
  trainingSpeed: number;
}

// Experience Replay Buffer
interface Experience {
  state: GameState;
  action: Action;
  reward: number;
  nextState: GameState;
  done: boolean;
}

export class DQNAgent {
  private model: tf.LayersModel;
  private targetModel: tf.LayersModel;
  private experienceReplay: Experience[] = [];
  private maxReplaySize: number = 2000;
  private minibatchSize: number = 32;
  private updateFrequency: number = 10;
  private stepCount: number = 0;
  private episodeRewards: number[] = [];
  private currentEpisodeReward: number = 0;

  constructor(private hyperparams: Hyperparams) {
    this.model = this.createModel();
    this.targetModel = this.createModel();
    this.updateTargetModel();
  }

  private createModel(): tf.LayersModel {
    const model = tf.sequential();
    
    // Input layer
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
      inputShape: [6], // ballX, ballY, ballVelX, ballVelY, paddleY, aiPaddleY
    }));
    
    // Hidden layer
    model.add(tf.layers.dense({
      units: 32,
      activation: 'relu',
    }));
    
    // Output layer (3 actions: up, stay, down)
    model.add(tf.layers.dense({
      units: 3,
      activation: 'linear',
    }));
    
    model.compile({
      optimizer: tf.train.adam(this.hyperparams.alpha),
      loss: 'meanSquaredError',
    });
    
    return model;
  }

  private updateTargetModel(): void {
    // Copy weights from the regular model to the target model
    const weights = this.model.getWeights();
    this.targetModel.setWeights(weights);
  }

  public chooseAction(state: GameState): Action {
    // Exploration vs. exploitation
    if (Math.random() < this.hyperparams.epsilon) {
      // Exploration: random action
      return Math.floor(Math.random() * 3) as Action;
    } else {
      // Exploitation: best action based on Q-values
      return this.getBestAction(state);
    }
  }

  private getBestAction(state: GameState): Action {
    return tf.tidy(() => {
      const stateTensor = this.stateToTensor(state);
      const qValues = this.model.predict(stateTensor) as tf.Tensor;
      const bestAction = qValues.argMax(1).dataSync()[0];
      return bestAction as Action;
    });
  }

  private stateToTensor(state: GameState): tf.Tensor {
    // Normalize values to improve learning
    return tf.tensor2d([
      [
        state.ballX, 
        state.ballY, 
        state.ballVelX, 
        state.ballVelY, 
        state.paddleY,
        state.aiPaddleY
      ]
    ]);
  }

  public remember(state: GameState, action: Action, reward: number, nextState: GameState, done: boolean): void {
    this.currentEpisodeReward += reward;
    
    // Add experience to replay buffer
    this.experienceReplay.push({ state, action, reward, nextState, done });
    
    // Maintain max size of replay buffer
    if (this.experienceReplay.length > this.maxReplaySize) {
      this.experienceReplay.shift();
    }
    
    // Record completed episode
    if (done) {
      this.episodeRewards.push(this.currentEpisodeReward);
      this.currentEpisodeReward = 0;
    }
  }

  public async replay(): Promise<void> {
    const { gamma } = this.hyperparams;
    
    // Wait until we have enough experiences
    if (this.experienceReplay.length < this.minibatchSize) {
      return;
    }

    // Increment step counter and check if we need to update target network
    this.stepCount++;
    if (this.stepCount % this.updateFrequency === 0) {
      this.updateTargetModel();
    }
    
    // Sample random minibatch from replay buffer
    const sampleIndices = this.getRandomIndices(this.minibatchSize, this.experienceReplay.length);
    const minibatch = sampleIndices.map(index => this.experienceReplay[index]);
    
    // Create tensors for batch processing
    const stateTensors = tf.concat(
      minibatch.map(exp => this.stateToTensor(exp.state))
    );
    
    const nextStateTensors = tf.concat(
      minibatch.map(exp => this.stateToTensor(exp.nextState))
    );
    
    // Get Q values for current states
    const qValues = this.model.predict(stateTensors) as tf.Tensor;
    // Get Q values for next states from target model
    const nextQValues = this.targetModel.predict(nextStateTensors) as tf.Tensor;
    
    // Create updated Q values batch
    const qValuesData = qValues.arraySync() as number[][];
    const nextQValuesData = nextQValues.arraySync() as number[][];
    
    // Update Q values with Bellman equation
    for (let i = 0; i < this.minibatchSize; i++) {
      const { action, reward, done } = minibatch[i];
      
      if (done) {
        qValuesData[i][action] = reward;
      } else {
        const nextMaxQ = Math.max(...nextQValuesData[i]);
        qValuesData[i][action] = reward + gamma * nextMaxQ;
      }
    }
    
    // Train the model with updated Q values
    const updatedQValues = tf.tensor2d(qValuesData);
    
    await this.model.trainOnBatch(stateTensors, updatedQValues);
    
    // Cleanup tensors
    stateTensors.dispose();
    nextStateTensors.dispose();
    qValues.dispose();
    nextQValues.dispose();
    updatedQValues.dispose();
  }
  
  private getRandomIndices(count: number, max: number): number[] {
    const indices: number[] = [];
    while (indices.length < count) {
      const randIndex = Math.floor(Math.random() * max);
      if (!indices.includes(randIndex)) {
        indices.push(randIndex);
      }
    }
    return indices;
  }
  
  public updateHyperparams(hyperparams: Hyperparams): void {
    this.hyperparams = hyperparams;
    
    // Update learning rate in the optimizer
    const optimizer = tf.train.adam(this.hyperparams.alpha);
    this.model.compile({
      optimizer,
      loss: 'meanSquaredError',
    });
  }
  
  public getEpisodeRewards(): number[] {
    return [...this.episodeRewards];
  }
} 