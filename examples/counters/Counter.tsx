import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../src/types';


const Model = {
    state: {
        value: 0
    },    
    increment(state): any { 
        return { value: state.value + 1 }; 
    },
    decrement(state): any { 
        return { value: state.value - 1 }; 
    },
    set(state, value): any { 
        return { value: value }
    }
}

export const ModelGenerated = {
    $model: Immutable.Map(Model.state),
    get value(): any {
        return this.$model.get('value');
    },
    $updateModel(model) {
        this.$model = model;
        this.onChange(this.$model);
    },
    onChange: () => {},
    increment() {
        this.$updateModel(this.$model.merge(Model.increment(this.$model.toJS())));
    },
    decrement() {
        this.$updateModel(this.$model.merge(Model.decrement(this.$model.toJS())));
    },
    set(value) {
        this.$updateModel(this.$model.merge(Model.set(this.$model.toJS(), value)));
    }                
}

ModelGenerated.increment = ModelGenerated.increment.bind(ModelGenerated);
ModelGenerated.decrement = ModelGenerated.decrement.bind(ModelGenerated);
ModelGenerated.set = ModelGenerated.set.bind(ModelGenerated);

export class View extends Component<IViewProperties,{}> {
    
    render() {  
        const counterStyle = {display: 'inline-block', padding: '2 20'};
        const model = ModelGenerated;
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
