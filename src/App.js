import React from 'react';
import Dashboard from './components/Dashboard';
import { DaysProvider } from './context/DaysContext';

function App() {
  return (
    <div className="App">
      <DaysProvider>
        <Dashboard />
      </DaysProvider>
    </div>
  );
}

export default App;
