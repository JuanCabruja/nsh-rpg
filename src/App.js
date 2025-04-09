import logo from './logo.svg';
import './App.css';
import { StatsProvider } from './Context/StatsContext';
import Calculadora from './Components/Calculadora';
import React from 'react';


function App() {
  return (
    <StatsProvider>
      <Calculadora />
    </StatsProvider>
  );
}

export default App;
