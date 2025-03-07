import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-white">RL-Pong</h1>
        <p className="text-gray-300">Interactive Reinforcement Learning with Pong</p>
      </div>
    </header>
  );
};

export default Header; 