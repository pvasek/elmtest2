import * as Immutable from 'immutable';

const generateProperties = (obj: any, state) => {
    if (!state) {
        return obj;
    }
    
    const defineProperty = (obj, key) => {
        Object.defineProperty(obj, key, {
                get: function() { return obj.$state.get(key); }
        });
    };
    
    const defineModel = (obj, key, nestedModel) => {
        Object.defineProperty(obj, key, {
            get: function() { return nestedModel; }
        });
                
        // hookup notifications
        nestedModel.onChange = (function() {
            this.$updateModel(this.$state.set(key, nestedModel.$state));
        }).bind(obj);    
    };
    
    Object.getOwnPropertyNames(state)
        .forEach(key => {
            const stateSlice = state[key];
            if (stateSlice.$isModel) {
                defineModel(obj, key, stateSlice);
            } else {
                defineProperty(obj, key);
            }
        });    
    return obj;
};

const generateMethods = (obj: any, stateObj: any) => {
    if (!stateObj) {
        return obj;
    }
    
    Object.getOwnPropertyNames(stateObj)
        .filter(i => typeof stateObj[i] === 'function')
        .forEach(i => {
            const method = stateObj[i];
            obj[i] = (function(...args) {
                const oldState = this.$state.toJS();
                const newState = this.$state.merge(method(oldState));
                this.$updateModel(newState);
            }).bind(obj);
        });    
    return obj;
}

export const Model = (template): any => {
    const state = template.state;
    const immutableState = Immutable.Map(state); 

    const result = {
        $template: template,
        $isModel: true,
        $state: immutableState,
        $updateModel(newModel) {
            this.$state = newModel;
            this.notifySubcribers(this.$state);
        },
        onChange: () => {},
        notifySubcribers(model = this.$state) {
            this.onChange(model);
        }
    };
    return generateMethods(generateProperties(result, state), template);
}
