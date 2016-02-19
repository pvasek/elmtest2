import * as Immutable from 'immutable';

const generateProperties = (obj: any, state, immutableState) => {
    Object.getOwnPropertyNames(state)
    .forEach(i => {
        Object.defineProperty(obj, i, {
            get: function() { return immutableState.get(i); }
        });        
    });    
    return obj;
};

const generateMethods = (obj: any, stateObj: any) => {
    Object.getOwnPropertyNames(stateObj)
    .filter(i => typeof stateObj[i] === 'function')
    .forEach(i => {
        const method = stateObj[i];
        obj[i] = (function(...args) {
            const oldState = this.$model.toJS();
            const newState = this.$model.merge(method(oldState));
            this.$updateModel(newState);
        }).bind(obj);
    });    
    return obj;
}

export const ModelProxy = (initialState): any => {
    const state = initialState.state;
    const immutableState = Immutable.Map(state); 

    const result = {
        $model: immutableState,
        $updateModel(newModel) {
            this.$model = newModel;
            this.notifySubcribers(this.$model);
        },
        onChange: () => {},
        notifySubcribers(model) {
            this.onChange(model);
        }
    };
    return generateMethods(generateProperties(result, state, immutableState), initialState);
}
