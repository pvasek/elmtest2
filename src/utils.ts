import * as React from 'react';

export const renderChildren = (children, props): any => {
    // if (!children) {
    //     return null;
    // }
    if (typeof children === 'string') {
        return children;
    }    
    return React.Children.map(children, (i: any) => React.cloneElement(i, props));
}