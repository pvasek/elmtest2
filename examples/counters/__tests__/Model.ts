import * as test from 'tape';
import { Test } from 'tape';
import { ModelProxy } from '../Model';
const initalData = {
    state: {
        value: 0
    },    
    increment(state): any { 
        return { value: state.value + 1 }; 
    },
    decrement(state): any { 
        return { value: state.value - 1 }; 
    },
    set(state, value): any { 
        return { value: value }
    }
};


test('Model - should generate a proxy', (t: Test) => {    
    const result = ModelProxy(initalData);
    t.ok(result);

    // export const ModelGenerated = {
    //     $model: Immutable.Map(Model.state),
    //     get value(): any {
    //         return this.$model.get('value');
    //     },
    //     $updateModel(model) {
    //         this.$model = model;
    //         this.onChange(this.$model);
    //     },
    //     onChange: () => {},
    //     increment() {
    //         this.$updateModel(this.$model.merge(Model.increment(this.$model.toJS())));
    //     },
    //     decrement() {
    //         this.$updateModel(this.$model.merge(Model.decrement(this.$model.toJS())));
    //     },
    //     set(value) {
    //         this.$updateModel(this.$model.merge(Model.set(this.$model.toJS(), value)));
    //     }                
    // }

    t.end(); 
});

test("Model - should generate simple value", (t: Test) => {
    const result = ModelProxy(initalData);
    t.ok(result);
    t.equal(result.value, 0);
    t.end(); 
});

test("Model - the simple value is readonly", (t: Test) => {
    const result = ModelProxy(initalData);
    t.ok(result);
    result.value = 5;
    t.equal(result.value, 0);
    t.end(); 
});

test("Model - should generate action method", (t: Test) => {
    const result = ModelProxy(initalData);
    t.ok(result);
    t.ok(result.increment);
    t.assert(typeof result.increment === 'function');
    t.end(); 
});

test("Model - action method should update model", (t: Test) => {
    const result = ModelProxy(initalData);
    t.ok(result);
    result.increment();
    t.equal(result.value, 1);
    t.end(); 
});