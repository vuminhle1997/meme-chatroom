import React from 'react';
import logo from './logo.svg';
import './static/css/styles.scss';
import GIPHYForm from './components/GIPHYForm';
import Layout from './components/Layout';
import SpotifyForm from './components/SpotifyForm';
require('dotenv').config()


function App() { 
  return (
    <div className="App">
      <Layout/>
    </div>
  );
}

export default App;
/*
<header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <GIPHYForm></GIPHYForm>
      </header>
      */