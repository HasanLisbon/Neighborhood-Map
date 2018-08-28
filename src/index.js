import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import App from './App.js';
import '../node_modules/font-awesome/css/font-awesome.min.css'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
