import * as React from 'react';
import { IViewProperties } from './types';
import { forwardAction } from './forwardAction';

export const renderChildren = (children, props): any => {
    // if (!children) {
    //     return null;
    // }
    if (typeof children === 'string') {
        return children;
    }    
    return React.Children.map(children, (i: any) => React.cloneElement(i, props));
}

export const compProps = (key: string, props: IViewProperties) => {
    return {
        model: props.model.get(key),
        dispatch: forwardAction(props.dispatch, key)
    };
};