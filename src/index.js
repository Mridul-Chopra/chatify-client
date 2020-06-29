import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Chat from './Chat'; // importing the chat component 
import {store} from './reduxImpl';  // importing the store 
import {Provider} from 'react-redux' // importing the redux provider
ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}> {/*wrap the app in the provider and set the store props*/}
      <Chat/>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
