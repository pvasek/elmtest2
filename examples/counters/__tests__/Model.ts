import { describe, it } from 'mocha';
import { assert } from 'chai';
import * as Immutable from 'immutable';
import { Model, $updateState } from '../Model';

describe('Model:', () => {
        
    const initalData = () => {
        return {
            state: {
                value: 0
            },    
            actions: {
                increment(state): any { 
                    return { value: state.value + 1 }; 
                },
                decrement(state): any { 
                    return { value: state.value - 1 }; 
                },
                set(state, value): any { 
                    return { value: value }
                }
            }
        };
    };

    describe('Simple model:', () => {
        it('Should generate a proxy', () => {    
            const result = Model(initalData());
            assert.ok(result);
        });

        it('Should generate a proxy without state', () => {    
            const result = Model({
                actions: {
                    method1() {}
                }
            });
            assert.ok(result);
            assert.ok(result.method1);
        });

        it('Proxy should include template', () => {
            const data = initalData();    
            const result = Model(data);
            assert.ok(result);
            assert.equal(result.$template, data);
        });

        it('Should generate simple value', () => {
            const result = Model(initalData());
            assert.ok(result);
            assert.equal(result.value, 0);
        });

        it('The simple value is readonly', () => {
            const result = Model(initalData());
            assert.ok(result);
            result.value = 5;
            assert.equal(result.value, 0);
        });

        it('Should generate action method', () => {
            const result = Model(initalData());
            assert.ok(result);
            assert.ok(result.increment);
            assert(typeof result.increment === 'function');
        });

        it('Changes on state should trigger $onChange', () => {
            const result = Model(initalData());
            assert.ok(result);
            let changed = false;
            assert.ok(result.$onChange, '$onChange does not exists');
            result.$onChange = () => changed = true;
            result.increment();
            assert.equal(result.value, 1);
            assert.ok(changed, '$onChange not called');        
        });
        
        it('Action method should update model', () => {
            const result = Model(initalData());
            assert.ok(result);
            result.increment();
            assert.equal(result.value, 1);
        });
    });
    
    describe('Nested models:', () => {
        
        it('Should create a model', () => {                        
            const leftModel = Model(initalData());
            
            const result = Model({
                key: 'root',
                state: {
                    left: leftModel
                }
            });
            assert.ok(result.left);
            assert.equal(result.left, leftModel);
        });

        it('Changes on state should trigger $onChange', () => {
            const leftModel = Model(initalData());
            const rightModel = Model(initalData());
            const result = Model({
                state: {
                    left: leftModel,
                    right: rightModel
                }
            });
            assert.ok(result.right, 'result.right exists');
            let rightChanged = false;
            result.$onChange = () => rightChanged = true;
            result.right.increment();
            assert.equal(result.right.value, 1, 'result.right.value');
            assert.ok(rightChanged, 'result.$onChange not called for right');
            
            assert.ok(result.left, 'result.left exists');
            let leftChanged = false;
            result.$onChange = () => leftChanged = true;
            result.left.increment();
            assert.equal(result.left.value, 1, 'result.left.value');
            assert.ok(leftChanged, 'result.$onChange not called for left');
        });
        
        it ('Should propagate state from parents', () => {
            const leftModel = Model(initalData());
            const rightModel = Model(initalData());
            const result = Model({
                state: {
                    left: leftModel,
                    right: rightModel
                }
            });
            result.$setState({ left: { value: 5}});
            assert.ok(result.left, 'left exists')
            assert.ok(result.left.value, 'left.value exists');
            assert.equal(result.left.value, 5, 'left.value');

            result.$setState({ right: { value: 5}});
            assert.ok(result.right, 'right exists')
            assert.ok(result.right.value, 'right.value exists');
            assert.equal(result.right.value, 5, 'right.value');
        });
        
        it ('Should update state for new models', () => {
            const leftModel = Model(initalData());
            const result = Model({
                state: {
                    left: leftModel
                },
                actions: {
                    addRight(state) {
                        const right = Model({});
                        const newState = { left: state.left, right };
                        return $updateState(newState);                    
                    }
                }
            });
            let changed = false;
            result.$onChange = () => changed = true;
            assert.notOk(result.right);
            result.addRight();
            assert.ok(result.right, 'Child model added');
            assert.ok(changed, '$onChanged called');                        
        });
        
    });
   
    
});