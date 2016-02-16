import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../src/types';
import { forwardAction} from './../../src/forwardAction';

import { ActionBar } from './components/ActionBar';
import { ActionButton } from './components/ActionButton';
import { BulkToolbar } from './components/BulkToolbar';
import { TextMatchFilter } from './reactComponents/filters/TextMatchFilter';
import { FilterBar, update as filterUpdate, init as filterInit } from './components/FilterBar';
import { View as Pager, update as pagerUpdate, init as pagerInit } from './components/Pager';
import { View as Table, update as tableUpdate, init as tableInit } from './components/Table';
import { DataColumn } from './reactComponents/tables/DataColumn';


const NEW_ITEM = 'NEW_ITEM';
const PAGER = 'PAGER';
const FILTER = 'FILTER';
const TABLE = 'TABLE';

export const init = () => Immutable.Map({
    [PAGER]: pagerInit(),
    [FILTER]: filterInit(),
    [TABLE]: tableInit()
});

export const update = (state: Immutable.Map<any, any> = init(), action: IAction): any => {
    if (action.type === PAGER) {
        return state.set(PAGER, pagerUpdate(state.get(PAGER), action.forwardedAction));
    }
    if (action.type === FILTER) {
        return state.set(FILTER, filterUpdate(state.get(FILTER), action.forwardedAction));
    }
    if (action.type === TABLE) {
        return state.set(TABLE, tableUpdate(state.get(TABLE), action.forwardedAction));
    }
    return state;
}

export class View extends Component<IViewProperties, {}> {
    private data = [
        { Id: '1', FirstName: "FirstName1", LastName: "LastName1"},
        { Id: '2', FirstName: "FirstName2", LastName: "LastName2"},
        { Id: '3', FirstName: "FirstName3", LastName: "LastName3"},
        { Id: '4', FirstName: "FirstName4", LastName: "LastName4"},    
        { Id: '5', FirstName: "FirstName5", LastName: "LastName5"},        
    ];
    
    render() {
        const arg = {};
        return (
            <div>
                <ActionBar dispatch={this.props.dispatch}>
                    <ActionButton title="New" type={NEW_ITEM}/>
                </ActionBar>
                
                <FilterBar model={this.props.model.get(FILTER)} dispatch={forwardAction(this.props.dispatch, FILTER)} >
                    <TextMatchFilter property="Name"/>
                </FilterBar>
                
                <Pager model={this.props.model.get(PAGER)} dispatch={forwardAction(this.props.dispatch, PAGER)} />
                
                <BulkToolbar dispatch={this.props.dispatch}>Bulk toolbar</BulkToolbar>
                
                <Table data={this.data} model={this.props.model.get(TABLE)} dispatch={forwardAction(this.props.dispatch, TABLE)}>
                    <DataColumn title="First Name" field="FirstName"/>
                    <DataColumn title="Last Name" field="LastName"/>                
                </Table>
                
            </div>
        );
    }
}

export const effects = {
    html: View
}