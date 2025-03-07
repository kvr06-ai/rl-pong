import React, { useState } from 'react';

const RLInfoPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">About Reinforcement Learning in Pong</h2>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4 space-y-3 text-gray-300">
          <section>
            <h3 className="text-lg font-semibold text-white">What is Reinforcement Learning?</h3>
            <p>
              Reinforcement Learning (RL) is a type of machine learning where an agent learns to make decisions by taking 
              actions in an environment to maximize cumulative reward. Unlike supervised learning, RL doesn't require labeled 
              training data - instead, the agent learns from its own experiences through trial and error.
            </p>
          </section>
          
          <section>
            <h3 className="text-lg font-semibold text-white">How RL Works in This Pong Game</h3>
            <p>
              In our Pong implementation, the AI paddle (right side) is controlled by a Deep Q-Learning (DQN) algorithm, which 
              combines Q-learning with neural networks to handle complex state spaces. The AI observes the game state (ball position, 
              velocity, paddle positions) and learns to choose the best action (move up, stay, or move down) to score points and 
              prevent you from scoring.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">Parameters You Can Adjust</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <span className="font-semibold">Exploration Rate (ε):</span> Controls how often the AI tries random actions vs. 
                actions it believes are optimal. Higher values encourage exploration of new strategies, while lower values make 
                the AI stick to what it has learned works best.
              </li>
              <li>
                <span className="font-semibold">Learning Rate (α):</span> Determines how quickly the AI incorporates new information. 
                Higher values make the AI adapt quickly but may cause instability, while lower values lead to more stable but slower learning.
              </li>
              <li>
                <span className="font-semibold">Discount Factor (γ):</span> Controls how much the AI values future rewards vs. immediate rewards. 
                Higher values make the AI prioritize long-term benefits, while lower values make it focus on immediate gains.
              </li>
              <li>
                <span className="font-semibold">Training Speed:</span> Adjusts how many training iterations the AI performs per game frame. 
                Higher values speed up learning but consume more computational resources.
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">Reward System</h3>
            <p>
              The AI receives rewards based on its performance:
            </p>
            <ul className="list-disc pl-5">
              <li>+10 points for successfully returning the ball</li>
              <li>+20 points for scoring against you</li>
              <li>-1 point when you successfully return the ball</li>
              <li>-20 points when it misses the ball (you score)</li>
            </ul>
            <p className="mt-2">
              Over time, the AI learns to maximize its cumulative reward by improving its paddle movement strategy.
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-white">Technical Implementation</h3>
            <p>
              This implementation uses TensorFlow.js to create and train a neural network in your browser. The network has 
              input neurons for the game state, two hidden layers with 32 neurons each, and output neurons representing the 
              Q-values for each possible action. Experience replay is used to help the AI learn efficiently from past experiences.
            </p>
          </section>
        </div>
      )}
    </div>
  );
};

export default RLInfoPanel; 