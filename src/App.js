import React, { Component } from 'react';
import './App.css';
import Dialogue from './Dialogue';



class App extends Component {
  
  constructor() {
    super();
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <Dialogue />
    );
  }
}

export default App;
