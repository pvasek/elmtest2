import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../src/types';

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const SET = 'SET';

const VALUE_KEY = 'value';
const FOCUS_KEY = 'focus';

export const init = () => (Immutable.Map({value: 0}));

export const update = (state: Immutable.Map<any, any> = init(), action: IAction): any => {
    switch (action.type) {        
        case INCREMENT:
            return  state.set(VALUE_KEY, state.get(VALUE_KEY) + 1 );
        case DECREMENT:
            return  state.set(VALUE_KEY, state.get(VALUE_KEY) - 1 );
        case SET: 
            return  state.set(VALUE_KEY, parseInt(action.payload, 10));
    }
    
    return state;
}

export class View extends Component<IViewProperties,{}> {
    
    constructor() {
        super();
        this.increment = this.increment.bind(this);
        this.decrement = this.decrement.bind(this);
        this.set = this.set.bind(this);
    }
    
    shouldComponentUpdate(nextProps: IViewProperties) {
        return nextProps.model !== this.props.model;
    }

    increment() {
        this.props.dispatch({type: INCREMENT});
    };
    
    decrement() {
        this.props.dispatch({type: DECREMENT});
    };

    set(e: any) {
        this.props.dispatch({type: SET, payload: e.target.value});
    };

    render() {  
        const counterStyle = {display: 'inline-block', padding: '2 20'};
        return (
            <div style={counterStyle}>
                <input type="text" onChange={this.set} value={this.props.model.get(VALUE_KEY)}/>
                {/*<span>{props.model.value}</span>*/}                
                <button onClick={this.increment}>+</button>
                <button onClick={this.decrement}>-</button>
            </div>
        );        
    }
};

export const effects = {
    html: View,
    focus: (state, dispatch) => state.get('FOCUS_KEY') ? {} : null
}
