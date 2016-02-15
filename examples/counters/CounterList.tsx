import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';

import { View as Counter, update as updateCounter, init as initCounter, effects as effectsCounter } from './CounterPair'; 

import { IAction, IViewProperties } from './../../src/types';
import { forwardAction } from './../../src/forwardAction';

const COUNTER = 'COUNTER';
const ADD_COUNTER = 'ADD_COUNTER';

export const init = () => {
    const result = [];
    for (var i = 0; i < 50; i++) {
        result[i] = initCounter();
    }
    return Immutable.Map({
        [COUNTER]: Immutable.List(result)
    });
};

export const update = (state: Immutable.Map<any, any> = init(), action: IAction) => {
    if (action.type === ADD_COUNTER) {
        return state.set(COUNTER, state.get(COUNTER).push(initCounter()));
    } 
    if (action.type === COUNTER) {
        const index = action.forwardedAction.type as number;
        const counters = state.get(COUNTER);
        const counter = counters.get(index);
        return state.set(COUNTER, counters.set(index, updateCounter(counter, action.forwardedAction.forwardedAction))); 
    }
    return state;
}

export class View extends Component<IViewProperties,{}> {
    
    constructor() {
        super();
        this.addCounter = this.addCounter.bind(this);
    }
    
    shouldComponentUpdate(nextProps: IViewProperties) {
        return nextProps.model !== this.props.model;
    }

    addCounter() {
        this.props.dispatch({type: ADD_COUNTER});
    }
        
    render() {                
        const items = this.props.model.get(COUNTER).map((item, index) => 
            (<Counter key={index} 
                model={item} 
                dispatch={forwardAction(this.props.dispatch, COUNTER, index)}
            />)
            );
            
        return (
            <div>
                <h2>List</h2>
                <div>
                    {items}                    
                </div>
                <div>
                    <button onClick={this.addCounter}>Add counter</button>
                </div>
            </div>
        );
    }
}

export const effects = {
    html: View,
    http: (state, dispatch) => state.get(COUNTER).count() === 51 ? [
        {
            url: 'url'
        }
    ] : [],
    focus: effectsCounter.focus
}