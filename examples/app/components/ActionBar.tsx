import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../../src/types';
import { renderChildren } from './../../../src/utils';

export class ActionBar extends Component<any, {}> {
    
    render() {
        return (
            <div className="actionbar-component">
                <div className="actionbar-component-items">
                    {renderChildren(this.props.children, { dispatch: this.props.dispatch})}
                </div>
            </div>
        );
    }
} 