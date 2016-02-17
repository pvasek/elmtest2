import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../src/types';
import { forwardAction} from './../../src/forwardAction';
import { forwardUpdates } from './../../src/forwardUpdates';

import { ActionBar } from './components/ActionBar';
import { ActionButton } from './components/ActionButton';
import { BulkActionBar } from './components/BulkActionBar';
import { TextMatchFilter } from './reactComponents/filters/TextMatchFilter';
import { FilterBar, update as filterUpdate, init as filterInit } from './components/FilterBar';
import { View as Pager, update as pagerUpdate, init as pagerInit } from './components/Pager';
import { View as Table, update as tableUpdate, init as tableInit } from './components/Table';
import { DataColumn } from './reactComponents/tables/DataColumn';


const actions = {
    NEW_ITEM: 'NEW_ITEM',
    DELETE: 'DELETE'
}

const keys = {
    PAGER: 'pager',
    FILTER: 'filter',
    TABLE: 'table'
}

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

export const compProps = (key: string, props: IViewProperties) => {
    return {
        model: props.model.get(key),
        dispatch: forwardAction(props.dispatch, key)
    };
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
        return (
            <div>
                <ActionBar dispatch={this.props.dispatch}>
                    <ActionButton title="New" type={actions.NEW_ITEM}/>
                </ActionBar>
                
                <FilterBar {...compProps(keys.FILTER, this.props)} >
                    <TextMatchFilter property="Name"/>
                </FilterBar>
                
                <Pager {...compProps(keys.PAGER, this.props)} />
                
                <BulkActionBar model={this.props.model.get(keys.TABLE).get('selectedIds')} dispatch={this.props.dispatch}>
                    <ActionButton title="Delete" type={actions.DELETE}/>
                </BulkActionBar>
                
                <Table data={this.data}  {...compProps(keys.TABLE, this.props)} >
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