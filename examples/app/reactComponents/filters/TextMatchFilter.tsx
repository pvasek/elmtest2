import * as React from 'react';
import { Component } from 'react';

export class TextMatchFilter extends Component<any, {}> {
    
    render() {
        const { model, property } = this.props;
        return (
            <input type="text" value={model[property]} onChange={(e: any) => this.props.onFilterChange(property, e.target.value)}/>
        );
    }
} 