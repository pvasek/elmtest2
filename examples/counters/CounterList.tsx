import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import { Model, $updateState } from './Model';
import { View as Counter, createModel as counterCreateModel } from './Counter'; 


export const createModel = () => Model({
    state: {
        counterCount: 0
    },
    actions: {
        addCounter(state) {
            const newState = _.merge({}, state, {
                counterCount: state.counterCount + 1, 
                [`counter${state.counterCount}`]: counterCreateModel() 
            });
            return $updateState(newState);
        }    
    }
});

const range = (to) => {
    const result = [];
    for (let i = 0; i < to; i++) {
        result.push(i);
    }
    return result;
}
export class View extends Component<any,{}> {               
    render() {      
        const model = this.props.model;
        
        const items = range(model.counterCount).map(index => {
            const item = model[`counter${index}`];
            return (<Counter key={index} model={item}/>);
        });
            
        return (
            <div>
                <h2>List</h2>
                <div>
                    {items}                    
                </div>
                <div>
                    <button onClick={model.addCounter}>Add counter</button>
                </div>
            </div>
        );
    }
}