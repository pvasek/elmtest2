import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../../src/types';
import { action } from './../../../src/action';
import { renderChildren } from './../../../src/utils';


const FILTER_CHANGED = 'FILTER_CHANGED';

export const init = () => Immutable.Map({});

export const update = (state: Immutable.Map<any, any> = init(), action: IAction) => {
    if (action.type === FILTER_CHANGED) {
        const { property, value } = action.payload;
        return state.set(property, value);
    }
    return state;
}

export class FilterBar extends Component<any, {}> {
    
    constructor() {
        super();
        this.onFilterChange = this.onFilterChange.bind(this);
    }
    
    onFilterChange(property: string, value: any) {
        this.props.dispatch(action(FILTER_CHANGED, { property, value}));
    }
    
    render() {
        const model = this.props.model.toJS();
        return (
            <div className="filterbar">
                <div className="fitlerbar-items">
                    {renderChildren(this.props.children, { model, onFilterChange: this.onFilterChange })}
                </div>
            </div>
        );
    }
} 