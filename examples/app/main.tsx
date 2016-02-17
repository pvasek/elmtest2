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
import { update, init, effects } from './List'; 


const middlewares = applyMiddleware(    
    //actionWorkflowMiddleware(workflows),
    actionLogMiddleware(i => i ? i.toJS() : null));
    
const createStoreWithMiddleware = compose(middlewares)(createStore);

startApp({update, init, effects }, createStoreWithMiddleware, [htmlDriver]);