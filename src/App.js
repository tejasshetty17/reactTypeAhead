import React, { Component } from 'react';
import TypeAhead from './components/TypeAhead'
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <TypeAhead config={{dataSrc: 'http://demo2045363.mockable.io/', caseSensitiveMatch: false, autoComplete: 'off', placeHolder: 'Type here', spellCheck: 'false'}} />
      </div>
    );
  }
}

export default App;
