import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../../src/types';
import { action } from './../../../src/action';
import { renderChildren } from './../../../src/utils';
import { Table } from './../reactComponents/tables/Table';


const ADD_TO_SELECTION = 'ADD_TO_SELECTION';
const REMOVE_FROM_SELECTION = 'REMOVE_FROM_SELECTION';

const SELECTED_IDS = 'selectedIds';

export const init = () => Immutable.Map({
    selectedIds: Immutable.Set()
});

export const update = (state: Immutable.Map<any, any> = init(), action: IAction) => {
    if (action.type === ADD_TO_SELECTION) {
        const selectedIds = state.get(SELECTED_IDS);
        return state.set(SELECTED_IDS, selectedIds.add(action.payload));
    }
    if (action.type === REMOVE_FROM_SELECTION) {
        const selectedIds: Immutable.List<any> = state.get(SELECTED_IDS);
        return state.set(SELECTED_IDS, selectedIds.delete(action.payload));
    }
    return state;
}

export interface ITableViewProperties extends IViewProperties {
    data: Array<any>
}

export class View extends Component<ITableViewProperties, {}> {
    
    constructor() {
        super();
        this.isRowSelected = this.isRowSelected.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
    }
    
    onSelectionChanged(item, selected) {
        const actionType = selected ? ADD_TO_SELECTION : REMOVE_FROM_SELECTION;
        this.props.dispatch(action(actionType, item.Id));
    }
    
    isRowSelected(item) {
        return this.props.model.get('selectedIds').includes(item.Id);
    }
    
    render() {
        return (
            <Table 
                className="table" {...this.props} 
                list={this.props.data}
                onSelectionChanged={this.onSelectionChanged} 
                isRowSelected={this.isRowSelected} />
        );
    }
} 