import * as Immutable from 'immutable';

const UPDATE_MODEL = 'UPDATE_MODEL';

interface IActionResult {
    $actionResult: string,
    state: any    
};

export const $updateState = (state: any): IActionResult => {
    return { $actionResult: UPDATE_MODEL, state: state };
}

let groupPrefix = [];
const logGroup = (groupTitle) => {
    groupPrefix.push(groupTitle);
};
const logGroupEnd = () => {
    groupPrefix.pop();
};
const logDebug = (...args) => {
    const prefix = groupPrefix.join(' > '); 
    console.log(prefix, ...args); 
};
//const log = (...args) => {}; 
const log = logDebug;

const getStateItems = (state: any) => {
    if (!state) {
        return {
            properties: [],
            models: []
        };
    }
    const items = Object
        .getOwnPropertyNames(state)
        .map(i => ({ key: i, value: state[i] }));
        
    return {
        properties: items.filter((i: any) => i.value.$isModel === undefined),
        models: items.filter((i: any) => i.value.$isModel),
    };
};

const createImmutableState = (stateTemplate: any) => {
    const items = getStateItems(stateTemplate);
    let state = items.properties.reduce((acc, i) => {
        log('createImmutableState', 'constructor', 'property: ', i.key);
        acc[i.key] = i.value;
        return acc;
    }, {})
    state = items.models.reduce((acc, i) => {
        log('createImmutableState', 'constructor', 'model: ', i.key);
        acc[i.key] = i.value.$state;
        return acc;
    }, state)
    
    const result = Immutable.Map(state);
    log('createImmutableState', 'result', result.toJS());
    return result;
};

export const Model = (template): any => {

    class ModelClass {
        
        constructor(template) {
            this.$template = template;
            this.$key = template.key || 'root';
            this.generateProperties();
            this.generateMethods();                        
            log(this.$key, 'constructor', 'initialState: ', this.$state);
        }
        
        $key: string;
        $template: any;
        $isModel = true;
        $models = {};
        $state: Immutable.Map<any, any>;
        $onChange: Function = () => {};
        $onPromoteState: Function = null;
        
        private generateProperties(stateTemplate = this.$template.state) {            
            if (!stateTemplate) {
                return;
            }
            
            const defineProperty = (obj, key) => {
                Object.defineProperty(obj, key, {
                    get: function() { 
                        log('defineProperty', obj.$state);
                        return obj.$state.get(key); 
                    }
                });
            };
            
            const defineModel = (obj, key, nestedModel) => {
                nestedModel.$key = key;
                Object.defineProperty(obj, key, {
                    get: function() { 
                        log('defineProperty nestedModel');
                        return nestedModel; 
                    }
                });
                        
                obj.$models[key] = nestedModel;
                
                // hookup notifications
                nestedModel.$onPromoteState = (function(immutableState: Immutable.Map<any, any>) {
                    log('promoting state from child ', 'state: ', immutableState);
                    obj.$promoteState(obj.$state.set(key, immutableState));
                });
            };
            
            Object.getOwnPropertyNames(stateTemplate)
                .filter(key => this[key] === undefined)
                .forEach(key => {
                    const stateSlice = stateTemplate[key];
                    if (stateSlice.$isModel) {
                        defineModel(this, key, stateSlice);
                    } else {
                        defineProperty(this, key);
                    }
                });    
                
            this.$state = createImmutableState(stateTemplate);
        }
        
        private generateMethods() {
            const actionsTemplate = this.$template.actions;
            
            if (!actionsTemplate) {
                return;
            }
            
            Object.getOwnPropertyNames(actionsTemplate)
                .filter(key => typeof actionsTemplate[key] === 'function')
                .forEach(i => {
                    const key = i;
                    const method = actionsTemplate[key];
                    this[key] = (function (...args) {
                        log(this.$key, 'action, state: ', this.$state);
                        const oldState = this.$state.toJS();
                        const newState = method(oldState, ...args);
                        const finalState = newState.$actionResult === UPDATE_MODEL ? newState.state : newState;
                        const result = this.$state.merge(finalState);
                        if (newState.$actionResult) {
                            this.generateProperties(result.toJS());
                        } 
                        this.$promoteState(result);                    
                    }).bind(this);
                });    
        }
        
        $promoteState(immutableState: Immutable.Map<any, any>) {
            logGroup(`${this.$key} $promoteState`);
            log('immutableState: ', immutableState);
            if (this.$onPromoteState) {
                log('promoting state level up');
                this.$onPromoteState(immutableState, this.$key);
            } else {
                log('setting state, no promotion');
                this.$setState(immutableState);
            }            
            logGroupEnd();
        }    
        
        $setState(immutableState: Immutable.Map<any, any> | any, silent = false): void {
            immutableState = Immutable.fromJS(immutableState);
            logGroup(`${this.$key} $setState`);
            log('silent: ', silent, 'state: ', immutableState);
            this.$state = immutableState;
            
            Object.getOwnPropertyNames(this.$models).forEach((function (key) {
                log('calling for child models', key);
                this.$models[key].$setState(this.$state.get(key), true);
                log('calling for child models - DONE', key);
            }).bind(this));
            log('continuing');
            
            if (!silent) {
                log('calling $onChange');
                this.$onChange(this.$state);
                log('$onChange called');
            }
            logGroupEnd();
        }  
    };
    
    return new ModelClass(template);
}
