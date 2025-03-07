# RL-Pong: Interactive Reinforcement Learning Web App

## Overview
RL-Pong is an interactive web application designed to demonstrate reinforcement learning (RL) principles using the classic Pong game environment. Users will play against an AI-powered paddle whose behavior dynamically evolves based on user-configurable RL parameters.

## Product Goals
- Clearly illustrate core RL concepts: exploration vs. exploitation, hyperparameter tuning, reward functions.
- Provide a responsive, user-friendly interface to interact with RL algorithms.
- Enable real-time visualization of RL learning dynamics.

## Features & Functionalities

### Core Gameplay
- Classic Pong-style gameplay:
  - Vertical paddle control (up/down) by the user.
  - AI paddle controlled via RL algorithm.
- Ball movement with collision detection and angle reflection logic.
- Scoring: Points increase when a player misses the ball.

### RL Algorithm Implementation
- Algorithm: Deep Q-Learning with Neural Network function approximation.
- Libraries: TensorFlow.js for neural network computations.

### Hyperparameters & Controls (Interactive UI Sliders/Input Boxes)
- Exploration Rate (`epsilon`): Adjusts exploration vs. exploitation.
  - Range: 0.01 (fully exploitative) to 1 (fully exploratory)
  - Default: 0.1
- Learning Rate (`alpha`): Speed of Q-value updates.
  - Range: 0.0001 - 0.01
  - Default: 0.001
- Discount Factor (`gamma`): Long-term vs. immediate reward prioritization.
  - Range: 0.5 - 0.99
  - Default: 0.95
- Training Speed: Adjustable training speed multiplier.
  - Range: 1x (real-time) - 5x
  - Default: 1x

### Real-time Analytics & Visualization
- **Live Scoreboard**: Tracks user vs. AI score in real-time.
- **Epsilon Decay Graph**: Visualizes exploration rate over time.
- **Reward History Graph**: Tracks cumulative reward per episode.

### Technical Stack
- **Frontend**:
  - HTML5 Canvas for real-time rendering
  - React for UI components and interactivity
  - TailwindCSS for UI styling
  - TensorFlow.js for client-side machine learning
- **Backend**:
  - Static hosting-compatible (GitHub Pages, Netlify, Vercel)

## Architecture & Data Flow
1. User initializes the app and adjusts RL hyperparameters through the React UI.
2. Parameters update the TensorFlow.js neural network environment.
3. Gameplay starts:
   - User input handled via keyboard controls.
   - AI paddle actions determined by the Deep Q-Learning model.
4. RL Model:
   - Collects state-action-reward data in real-time.
   - Trains continuously using Q-learning update rules.
5. Real-time metrics and visualizations update after each game frame.

## Neural Network Specifications
- **Input layer**: Current game state (ball position and velocity, paddle positions).
- **Hidden layers**: Two dense layers with 32 neurons each, activation = ReLU.
- **Output layer**: Q-values for paddle actions (move up, stay, move down).
- **Loss function**: Mean Squared Error (MSE).
- **Optimizer**: Adam Optimizer with adjustable learning rate.

## User Interface (UI)
### Gameplay Screen
- Pong canvas area
- Current score display
- Controls for pause/resume/reset

### Sidebar/Control Panel
- Hyperparameter adjustment sliders
- Start/Pause Training button
- Graph visualizations:
  - Epsilon Decay
  - Cumulative Reward History

### Responsive Design
- Compatible across desktop and mobile devices (touch-friendly controls).
- Adaptive UI layout using Tailwind CSS.

## Performance & Optimization
- Game loop optimized for 60 FPS performance.
- Lightweight TensorFlow.js model optimized for web execution.
- Smooth, low-latency paddle and ball animations.

## Accessibility Considerations
- Keyboard accessibility for paddle control and hyperparameter adjustments.
- Clear and descriptive labels for UI controls and graphs.

## Deployment & Version Control
- GitHub repository with structured branches (`main`, `dev`, `feature/*`).
- Continuous deployment via platforms like Vercel or GitHub Pages.
- Regular backups and checkpoints of trained models.

## Testing & QA
- Unit tests (Jest, React Testing Library) for UI components.
- Integration tests for RL algorithm robustness.
- Manual playtesting for user experience refinement.

## Deliverables & Timeline
- **Phase 1** (Weeks 1-2): Basic gameplay functionality, frontend setup.
- **Phase 2** (Weeks 3-4): RL model implementation, integration.
- **Phase 3** (Weeks 5-6): Visualization and UI refinement.
- **Phase 4** (Weeks 7-8): Performance optimization, deployment.