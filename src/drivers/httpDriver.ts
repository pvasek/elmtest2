import * as flyd from 'flyd';
import { Stream } from 'flyd';

export const httpDriver = (effects: any, storeDispatch: Function, stateStream$: Stream) => {
    const httpEffect = effects.http;
    if (httpEffect) {
        const http$ = flyd.map(state => httpEffect(state, storeDispatch), stateStream$);
        flyd.on(http => {         
            http.forEach(i => console.log(i));
        }, http$);    
    }
};

