import * as test from 'tape';
import { Test } from 'tape';
import { action } from '../action';

test('action - should generate action', (t: Test) => {
    const type = 'ACTION1';
    const payload = {};
    const result = action(type, payload);
    t.equal(type, result.type);
    t.equal(payload, result.payload);
    t.end(); 
});