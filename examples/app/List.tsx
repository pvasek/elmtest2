import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../src/types';
import { forwardAction} from './../../src/forwardAction';
import { forwardUpdates } from './../../src/forwardUpdates';
import { action } from './../../src/action';
import { compProps as p } from './../../src/utils';

import { TextMatchFilter } from './reactComponents/filters/TextMatchFilter';
import { DataColumn } from './reactComponents/tables/DataColumn';

import { ActionBar } from './components/ActionBar';
import { ActionButton } from './components/ActionButton';
import { BulkActionBar } from './components/BulkActionBar';
import { FilterBar, update as filterUpdate, init as filterInit } from './components/FilterBar';
import { View as Pager, update as pagerUpdate, init as pagerInit, data as pagerData } from './components/Pager';
import { View as Table, update as tableUpdate, init as tableInit, data as tableData } from './components/Table';

const actions = {
    NEW_ITEM: 'NEW_ITEM',
    DELETE: 'DELETE',
    DATA_LOADED: 'DATA_LOADED'
};

const keys = {
    PAGER: 'pager',
    FILTER: 'filter',
    TABLE: 'table',
    DATA: 'data',
    LAST_DATA_URL: 'lastDataUrl'
};

export const init = () => Immutable.Map({
    [keys.PAGER]: pagerInit(),
    [keys.FILTER]: filterInit(),
    [keys.TABLE]: tableInit()
});

export const update = (state: Immutable.Map<any, any> = init(), action: IAction): any => {
    return forwardUpdates({
        [keys.PAGER]: pagerUpdate,
        [keys.FILTER]: filterUpdate,
        [keys.TABLE]: tableUpdate
    }, state, action);
};

export class View extends Component<IViewProperties, {}> {
    private data = [
        { Id: '1', FirstName: "FirstName1", LastName: "LastName1"},
        { Id: '2', FirstName: "FirstName2", LastName: "LastName2"},
        { Id: '3', FirstName: "FirstName3", LastName: "LastName3"},
        { Id: '4', FirstName: "FirstName4", LastName: "LastName4"},    
        { Id: '5', FirstName: "FirstName5", LastName: "LastName5"},        
    ];
    
    render() {
        const selectedIds = tableData.getSelectedIds(this.props.model.get(keys.TABLE));
        return (
            <div>
                <ActionBar dispatch={this.props.dispatch}>
                    <ActionButton title="New" type={actions.NEW_ITEM}/>
                </ActionBar>
                
                <FilterBar {...p(keys.FILTER, this.props)} >
                    <TextMatchFilter property="Name"/>
                </FilterBar>
                
                <Pager {...p(keys.PAGER, this.props)} />
                
                <BulkActionBar model={selectedIds} dispatch={this.props.dispatch}>
                    <ActionButton title="Delete" type={actions.DELETE}/>
                </BulkActionBar>
                
                <Table data={this.data}  {...p(keys.TABLE, this.props)} >
                    <DataColumn title="First Name" field="FirstName"/>
                    <DataColumn title="Last Name" field="LastName"/>                
                </Table>
                
            </div>
        );
    }
};

const dataUrl = (state) => {
    const sortingOptions = tableData.getSortingOptions(state.get(keys.TABLE));
    const pagingOptions = pagerData.getPagingOptions(state.get(keys.PAGER));
    console.log('List', sortingOptions, pagingOptions);
    return `person`
};

export const effects = {
    html: View,
    http: (state, dispatch) => {
        const url = dataUrl(state);
        if (url === state.get(keys.LAST_DATA_URL)) {
            return [];
        };
        return [
            {
                 url: url,
                 actionType: actions.DATA_LOADED 
            }
        ];
    }
}