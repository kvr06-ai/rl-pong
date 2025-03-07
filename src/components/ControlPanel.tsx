import React from 'react';
// Remove chart imports since we're not using them anymore
// import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
// import { Line } from 'react-chartjs-2';

// Remove chart registration since we're not using charts anymore
// ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Hyperparams {
  epsilon: number;
  alpha: number;
  gamma: number;
  trainingSpeed: number;
}

interface ControlPanelProps {
  hyperparams: Hyperparams;
  onHyperparamsChange: (params: Hyperparams) => void;
  isTraining: boolean;
  onToggleTraining: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ 
  hyperparams, 
  onHyperparamsChange,
  isTraining,
  onToggleTraining
}) => {
  // Remove mock data for charts since we're not using them anymore
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onHyperparamsChange({
      ...hyperparams,
      [name]: parseFloat(value)
    });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Control Panel</h2>
      
      <div className="mb-6">
        <button 
          onClick={onToggleTraining}
          className={`w-full py-2 px-4 rounded ${isTraining ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
        >
          {isTraining ? 'Stop Training' : 'Start Training'}
        </button>
      </div>

      <div className="overflow-y-auto flex-grow pr-2">
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Hyperparameters</h3>
          
          <div className="mb-3">
            <label className="block mb-1">
              Exploration Rate (ε): {hyperparams.epsilon.toFixed(2)}
            </label>
            <input 
              type="range" 
              name="epsilon" 
              min="0.01" 
              max="1" 
              step="0.01" 
              value={hyperparams.epsilon} 
              onChange={handleChange} 
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400">
              <span>0.01 (Exploit)</span>
              <span>1.0 (Explore)</span>
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">
              Learning Rate (α): {hyperparams.alpha.toFixed(4)}
            </label>
            <input 
              type="range" 
              name="alpha" 
              min="0.0001" 
              max="0.01" 
              step="0.0001" 
              value={hyperparams.alpha} 
              onChange={handleChange} 
              className="w-full"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">
              Discount Factor (γ): {hyperparams.gamma.toFixed(2)}
            </label>
            <input 
              type="range" 
              name="gamma" 
              min="0.5" 
              max="0.99" 
              step="0.01" 
              value={hyperparams.gamma} 
              onChange={handleChange} 
              className="w-full"
            />
          </div>
          
          <div className="mb-3">
            <label className="block mb-1">
              Training Speed: {hyperparams.trainingSpeed}x
            </label>
            <input 
              type="range" 
              name="trainingSpeed" 
              min="1" 
              max="5" 
              step="1" 
              value={hyperparams.trainingSpeed} 
              onChange={handleChange} 
              className="w-full"
            />
          </div>
        </div>
        
        {/* Remove the graph visualization sections */}
      </div>
    </div>
  );
};

export default ControlPanel; 