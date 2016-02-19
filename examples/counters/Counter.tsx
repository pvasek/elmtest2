import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../src/types';
import { Model } from './Model';


export const createModel = () => Model({
    state: {
        value: 0
    },  
      
    increment: (state) => ({ value: state.value + 1 }), 
    decrement: (state) => ({ value: state.value - 1 }), 
    set: (state, value) => ({ value: value }),
    reset: (state) => ({ value: 0 })
});

export class View extends Component<any,{}> {

    render() {  
        const counterStyle = {display: 'inline-block', padding: '2 20'};
        const model = this.props.model;
        return (
            <div style={counterStyle}>
                <input ref="input" type="text" onChange={model.set} value={model.value}/>
                {/*<span>{props.model.value}</span>*/}                
                <button onClick={model.increment}>+</button>
                <button onClick={model.decrement}>-</button>
            </div>
        );        
    }
};

export const effects = {
    html: View
}
