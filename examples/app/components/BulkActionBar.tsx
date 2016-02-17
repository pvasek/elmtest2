import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../../src/types';
import { renderChildren } from './../../../src/utils';
import { resources as r } from './resources';

export class BulkActionBar extends Component<any, {}> {
    
    render() {
        const selectedIds = this.props.model.toJS();
        if (selectedIds.length === 0) {
            return null;
        }
        console.log(r.selected());
        return (
            <div className="toolbar-bulk">
                <div className="toolbar-bulk-count">{selectedIds.length} {r.selected()}</div>
                <div className="toolbar-bulk-items">
                    {renderChildren(this.props.children, { dispatch: this.props.dispatch, payload: selectedIds })}
                </div>
            </div>
        );
    }
} 