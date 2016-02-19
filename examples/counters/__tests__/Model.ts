import * as test from 'tape';
import { Test } from 'tape';
import { Model } from '../Model';
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
    const result = Model(initalData);
    t.ok(result);
    t.end(); 
});

test('Model - should generate a proxy without state', (t: Test) => {    
    const result = Model({
        method1() {}
    });
    t.ok(result);
    t.ok(result.method1);
    t.end(); 
});

test('Model - proxy should include template', (t: Test) => {    
    const result = Model(initalData);
    t.ok(result);
    t.equal(result.$template, initalData);
    t.end(); 
});

test("Model - should generate simple value", (t: Test) => {
    const result = Model(initalData);
    t.ok(result);
    t.equal(result.value, 0);
    t.end(); 
});

test("Model - the simple value is readonly", (t: Test) => {
    const result = Model(initalData);
    t.ok(result);
    result.value = 5;
    t.equal(result.value, 0);
    t.end(); 
});

test("Model - should generate action method", (t: Test) => {
    const result = Model(initalData);
    t.ok(result);
    t.ok(result.increment);
    t.assert(typeof result.increment === 'function');
    t.end(); 
});

test("Model - action method should update model", (t: Test) => {
    const result = Model(initalData);
    t.ok(result);
    result.increment();
    t.equal(result.value, 1);
    t.end(); 
});

test("Model - should support nested models", (t: Test) => {
    const leftModel = Model(initalData);
    const result = Model({
        state: {
            left: leftModel
        }
    })
    t.ok(result.left);
    t.equal(result.left, leftModel);
    t.end(); 
});

test("Model - should support nested notifications", (t: Test) => {
    const leftModel = Model(initalData);
    const result = Model({
        state: {
            left: leftModel
        }
    })
    t.ok(result.left);
    let changed = false;
    result.onChange = () => changed = true;
    leftModel.increment();
    t.ok(changed);
    t.end(); 
});