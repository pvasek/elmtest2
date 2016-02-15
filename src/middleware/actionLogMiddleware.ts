import { IAction } from './../types';

export const actionLogMiddleware = convertState => store => next => (action: IAction) => {
    const before = convertState(store.getState());    
    const result = next(action);
    const after = convertState(store.getState());
    console.log('ACTION: ' + action.type, action, 'before:', before, 'after:', after);
    return result;  
};