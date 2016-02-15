import * as flyd from 'flyd';
import { Stream } from 'flyd';

export const startApp = (app, createStoreFunc, drivers: Array<any>) => {
    const store = createStoreFunc(app.update, app.init());

    const action$ = flyd.stream();
    const state$ = flyd.stream(); 

    const unsubscribe = store.subscribe(() => {
        (state$ as any)(store.getState());    
    });

    drivers.forEach(driver => {
        driver(app.effects, store.dispatch, state$);
    })

    store.dispatch({type: 'INIT'});
    
    return () => unsubscribe();
}