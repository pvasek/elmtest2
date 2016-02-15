import { IAction, DispatchHandler } from './types';
import { action } from './action';

const buildActionTree = (types: Array<any>, finalAction: IAction): IAction => {
    {
        const result = action(types[0]);
        
        result.forwardedAction = types.length > 1 ? 
            buildActionTree(types.slice(1), finalAction)
            : finalAction;
            
        return result;
    }
};

export const forwardAction = (dispatch: DispatchHandler, ...types: Array<any>): DispatchHandler => {
    return (action: IAction) => {
        const result = buildActionTree(types, action);
        return dispatch(result);
    };
};
