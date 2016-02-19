import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as flyd from 'flyd';
import { Stream } from 'flyd';
import { createStore, applyMiddleware, compose } from 'redux';
import { IAction } from './../../src/types';
import { actionWorkflowMiddleware } from './../../src/middleware/actionWorkflowMiddleware';
import { actionLogMiddleware } from './../../src/middleware/actionLogMiddleware';
import { startApp } from './../../src/startApp';
import { htmlDriver } from './../../src/drivers/htmlDriver';
import { View, ModelGenerated } from './Counter'; 

const updateHandler = (dispatch, actionInfo, getState) => {
    console.log('SET called', actionInfo);
    dispatch({type: 'UPDATE_INFO'});
};

const workflows = {
    'SET': updateHandler,
    'INCREMENT': updateHandler,
    'DECREMENT': updateHandler,
    'UPDATE_INFO': (dispatch, actionInfo, getState) => {
        console.log('UPDATE_INFO called', actionInfo);
    }
};

const middlewares = applyMiddleware(    
    //actionWorkflowMiddleware(workflows),
    actionLogMiddleware(i => i.toJS()));
    
const createStoreWithMiddleware = compose(middlewares)(createStore);

const appElement = document.getElementById('app');

const render = () => {
    ReactDOM.render(React.createElement(View), appElement)
};

ModelGenerated.onChange = () => {
    render();
}

render();

