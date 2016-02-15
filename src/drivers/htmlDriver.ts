import * as React from 'react';
import { Component } from 'react';
import * as ReactDOM from 'react-dom';
import * as flyd from 'flyd';
import { Stream } from 'flyd';

export const htmlDriver = (effects: any, storeDispatch: Function, stateStream$: Stream) => {
    const htmlEffect = effects.html;
    const appElement = document.getElementById('app');
    const viewFunc = state =>  React.createElement(htmlEffect, { model: state, dispatch: storeDispatch}); 
    const html$ = flyd.map(viewFunc, stateStream$)
    const render = html => ReactDOM.render(html, appElement)
    flyd.on(render, html$)    
};
