import React, { useState } from 'react';
import Game from './components/Game';
import ControlPanel from './components/ControlPanel';
import Header from './components/Header';
import RLInfoPanel from './components/RLInfoPanel';

const App: React.FC = () => {
  const [hyperparams, setHyperparams] = useState({
    epsilon: 0.1,
    alpha: 0.001,
    gamma: 0.95,
    trainingSpeed: 1
  });

  const [isTraining, setIsTraining] = useState(false);
  const [ballSpeed, setBallSpeed] = useState(5); // Default ball speed
  
  const handleHyperparamsChange = (params: typeof hyperparams) => {
    setHyperparams(params);
  };
  
  const toggleTraining = () => {
    setIsTraining(!isTraining);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Header />
      <main className="flex flex-col p-4 gap-4">
        <RLInfoPanel />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-3/4 flex justify-center">
            <Game 
              hyperparams={hyperparams} 
              isTraining={isTraining}
              ballSpeed={ballSpeed}
            />
          </div>
          <div className="w-full md:w-1/4">
            <ControlPanel 
              hyperparams={hyperparams} 
              onHyperparamsChange={handleHyperparamsChange}
              isTraining={isTraining}
              onToggleTraining={toggleTraining}
              ballSpeed={ballSpeed}
              onBallSpeedChange={setBallSpeed}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App; 