import * as React from 'react';
import { Component } from 'react';
import * as Immutable from 'immutable';
import { action } from './../../../src/action';

export class ActionButton extends Component<any, {}> {
    render() {
        return (
            <button onClick={() => this.props.dispatch(action(this.props.type))}>
                {this.props.title}
            </button>
        );
    }
}
