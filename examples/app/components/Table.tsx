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
    UNSELECT_ALL: 'UNSELECT_ALL',
    SORT: 'SORT'
};

const keys = {
    SELECTED_IDS: 'selectedIds',
    SORT_BY: 'sortBy',
    SORT_DESCENDING: 'sortDescending'
};

type Model = Immutable.Map<any, any>;

export const init = (): Model => Immutable.Map({
    selectedIds: Immutable.Set(),
    sortBy: null,
    sortDescending: false
});

export interface ISortingOptions {
    sortBy: string,
    sortDescending: boolean
};

export const data = {
    
    getSelectedIds(state: Model): Immutable.Set<any> {
        return state.get(keys.SELECTED_IDS);
    },
    
    getSortingOptions(state: Model): ISortingOptions {
        const sortBy = state.get(keys.SORT_BY);        
        if (!sortBy) {
            return null;
        }        
        return {
            sortBy: sortBy,
            sortDescending: state.get(keys.SORT_DESCENDING)
        };
    }
}

export const update = (state: Model = init(), action: IAction) => {
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
    if (action.type === actions.SORT) {
        const stateJs = state.toJS();
        let desc = false;
	     if (state && stateJs.sortBy === action.payload) {
            desc = !stateJs.sortDescending
	     }
        return state
            .set(keys.SORT_BY, action.payload)
            .set(keys.SORT_DESCENDING, desc);
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
        this.onSortingChanged = this.onSortingChanged.bind(this);
    }
    
    onSortingChanged(field: string) {
        this.props.dispatch(action(actions.SORT, field));
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
                sortBy={this.props.model.get(keys.SORT_BY)}
                sortDescending={this.props.model.get(keys.SORT_DESCENDING)}
                isHeaderSelected={this.isHeaderSelected} 
                onAllSelectionChanged={this.onAllSelectionChanged}
                isRowSelected={this.isRowSelected}
                onSelectionChanged={this.onSelectionChanged}
                onSortingChanged={this.onSortingChanged}                 
            />
        );
    }
} 