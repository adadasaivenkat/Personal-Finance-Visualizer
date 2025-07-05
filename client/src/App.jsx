import React from 'react';
import Home from './pages/Home';
import './index.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Toaster position="bottom-right" reverseOrder={false} />
      <Home />
    </div>
  );
}

export default App; 