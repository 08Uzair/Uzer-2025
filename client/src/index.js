import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware ,compose} from 'redux';
import {thunk} from 'redux-thunk'
import reducers from './redux/reducers'
const root = ReactDOM.createRoot(document.getElementById('root'));
const store = createStore(reducers,compose(applyMiddleware(thunk)))
root.render(
    <React.StrictMode>
    <Provider store={store} >
        <App />
    </Provider>
    </React.StrictMode>
);

// Here we are creating a store and then we are passing that store as a prop in the provider component and after that we are wrapping our provider component to entire application component