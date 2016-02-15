import { IAction } from './types';

export const action = (type: string, payload?: any): IAction => {
    return {
        type,
        payload
    };     
};