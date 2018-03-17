import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import connectHooks from './connectHooks';

const ConnectedApp = connectHooks(App);

ReactDOM.render(<ConnectedApp />, document.getElementById('root'));
registerServiceWorker();
