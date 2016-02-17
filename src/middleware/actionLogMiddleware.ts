import { IAction } from './../types';

const buildPath = (action: IAction, acc: Array<IAction> = []): Array<IAction> => {
    if (!action) {
        return acc;
    }
    return buildPath(action.forwardedAction, [...acc, action])
}

export const actionLogMiddleware = convertState => store => next => (action: IAction) => {
    const before = convertState(store.getState());    
    const result = next(action);
    const after = convertState(store.getState());
    const actionPath = buildPath(action);
    const actionPathName = actionPath.map(i => i.type).join('>');
    const lastAction = actionPath.slice(-1);
    console.log('ACTION: ' + actionPathName, lastAction, 'before:', before, 'after:', after);
    return result;  
};