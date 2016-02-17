import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../../src/types';
import { action } from './../../../src/action';
import { renderChildren } from './../../../src/utils';
import { Table } from './../reactComponents/tables/Table';

const actions = {
    ADD_TO_SELECTION: 'ADD_TO_SELECTION',
    REMOVE_FROM_SELECTION: 'REMOVE_FROM_SELECTION',
    SELECT_ALL: 'SELECT_ALL',
    UNSELECT_ALL: 'UNSELECT_ALL'
};

const keys = {
    SELECTED_IDS: 'selectedIds'
}

export const init = () => Immutable.Map({
    selectedIds: Immutable.Set()
});

export const update = (state: Immutable.Map<any, any> = init(), action: IAction) => {
    if (action.type === actions.ADD_TO_SELECTION) {
        const selectedIds = state.get(keys.SELECTED_IDS);
        return state.set(keys.SELECTED_IDS, selectedIds.add(action.payload));
    }
    if (action.type === actions.REMOVE_FROM_SELECTION) {
        const selectedIds: Immutable.List<any> = state.get(keys.SELECTED_IDS);
        return state.set(keys.SELECTED_IDS, selectedIds.delete(action.payload));
    }
    if (action.type === actions.SELECT_ALL) {
        const selectedIds = state.get(keys.SELECTED_IDS);
        const allIds = action.payload.map(i => i.Id)
        return state.set(keys.SELECTED_IDS, selectedIds.union(allIds));
    }
    if (action.type === actions.UNSELECT_ALL) {
        const selectedIds = state.get(keys.SELECTED_IDS);
        return state.set(keys.SELECTED_IDS, selectedIds.clear());
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
        this.isHeaderSelected = this.isHeaderSelected.bind(this);
        this.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.onAllSelectionChanged = this.onAllSelectionChanged.bind(this);
    }
    
    onSelectionChanged(item, selected) {
        const actionType = selected ? actions.ADD_TO_SELECTION : actions.REMOVE_FROM_SELECTION;
        this.props.dispatch(action(actionType, item.Id));
    }
    
    isRowSelected(item) {
        return this.props.model.get(keys.SELECTED_IDS).includes(item.Id);
    }
    
    isHeaderSelected() {
        return this.props.model.get(keys.SELECTED_IDS).count() === this.props.data.length;
    }
    
    onAllSelectionChanged(selected) {
        const actionType = selected ? actions.SELECT_ALL : actions.UNSELECT_ALL;
        this.props.dispatch(action(actionType, this.props.data));        
    }
    
    render() {
        return (
            <Table 
                className="table" {...this.props} 
                list={this.props.data}
                isHeaderSelected={this.isHeaderSelected} 
                onAllSelectionChanged={this.onAllSelectionChanged}
                isRowSelected={this.isRowSelected}
                onSelectionChanged={this.onSelectionChanged}                 
            />
        );
    }
} 