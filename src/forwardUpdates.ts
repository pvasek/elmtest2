import { IAction } from './types';

export const forwardUpdates = (updaters, state, action: IAction) => {
    const updater = updaters[action.type];
    if (!updater) {
        return state;
    }
    const key = action.type;
    return state.set(key, updater(state.get(key), action.forwardedAction));    
};