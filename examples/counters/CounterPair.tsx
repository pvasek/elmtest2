// import * as React from 'react';
// import { Component } from 'react';
// import * as Immutable from 'immutable';
// import { View as Counter, update as updateCounter, init as initCounter } from './Counter'; 
// 
// import { IAction, IViewProperties } from './../../src/types';
// import { forwardAction } from './../../src/forwardAction';
// 
// const LEFT = 'LEFT';
// const RIGHT = 'RIGHT';
// const RESET = 'RESET';
// 
// export const init = () => Immutable.Map({
//     [LEFT]: initCounter(),
//     [RIGHT]: initCounter() 
// });
// 
// export const update = (state: Immutable.Map<any, any> = init(), action: IAction) => {
//     if (action.forwardedAction) {
//         return state.set(action.type, updateCounter(state.get(action.type), action.forwardedAction));
//     }
//     if (action.type === RESET) {
//         return init();
//     }
//     return state;
// }
// 
// export class View extends Component<IViewProperties,{}> {
//     constructor() {
//         super();
//         this.reset = this.reset.bind(this);
//     }
//     
//     shouldComponentUpdate(nextProps: IViewProperties) {
//         return nextProps.model !== this.props.model;
//     }
//     
//     reset() {
//         this.props.dispatch({type: RESET});
//     }
// 
//     render() {
//         const boxStyle = {float:'left', minWidth: 180};
//         return (
//             <div style={boxStyle}>
//                 <Counter model={this.props.model.get(LEFT)} dispatch={forwardAction(this.props.dispatch, LEFT)}/>
//                 <Counter model={this.props.model.get(RIGHT)} dispatch={forwardAction(this.props.dispatch, RIGHT)}/>
//                 <button onClick={this.reset}>reset</button>
//             </div>
//         );
//     }    
// }
// 
// export const effects = {
//     html: View
// };