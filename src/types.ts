export interface IAction {
    type: string|number,
    payload?: any,
    forwardedAction?: IAction
}

export interface ReducerHandler {
    (state: any, action: IAction): any;    
}

export interface DispatchHandler {
    (action: IAction): void;
}

export interface IViewProperties {
    model: any,
    dispatch: DispatchHandler
}
