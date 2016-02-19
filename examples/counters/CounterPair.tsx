import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { Model } from './Model';
import { View as Counter, createModel as counterCreateModel } from './Counter'; 

import { IAction, IViewProperties } from './../../src/types';
import { forwardAction } from './../../src/forwardAction';


export const createModel = () => {
    const model = Model({
        state: {
            left: counterCreateModel(),
            right: counterCreateModel()                        
        }
    });
    
    model.reset = () => {
        model.left.reset();
        model.right.reset();
    }

    return model;
};

export class View extends Component<any,{}> {    

    render() {
        const boxStyle = {float:'left', minWidth: 180};
        const model = this.props.model;
        return (
            <div style={boxStyle}>
                <Counter model={model.left}/>
                <Counter model={model.right}/>
                <button onClick={model.reset}>reset</button>
            </div>
        );
    }    
}

export const effects = {
    html: View
};