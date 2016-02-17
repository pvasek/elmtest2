import * as React from 'react';
import { Component, PropTypes } from 'react';
import * as classnames from 'classnames';
import * as Immutable from 'immutable';
import { IAction, IViewProperties } from './../../../src/types';
import { action } from './../../../src/action';


export const GO_TO_FIRST_PAGE = 'GO_TO_FIRST_PAGE';
export const GO_TO_LAST_PAGE = 'GO_TO_LAST_PAGE';
export const GO_TO_NEXT_PAGE = 'GO_TO_NEXT_PAGE';
export const GO_TO_PREVIOUS_PAGE = 'GO_TO_PREVIOUS_PAGE';
export const CHANGE_PAGE_SIZE = 'CHANGE_PAGE_SIZE';

type Model = Immutable.Map<any, any>;

export interface IPagingOptions {
    skip: number,
    take: number    
};

export const data = {    
    getPagingOptions(state: Model): IPagingOptions {
        const stateJs = state.toJS();
        return { 
            skip: stateJs.skip,
            take: stateJs.take 
        };
    }
};

export const init = (): Model => Immutable.Map({skip: 0, take: 20, count: 100})

export const update = (state: Model = init(), action = null) => {
	switch(action.type) {
		case CHANGE_PAGE_SIZE:
            return state.merge({ take: action.payload, skip: 0 });

		case GO_TO_FIRST_PAGE:
            return state.merge({skip: 0 });

		case GO_TO_LAST_PAGE: {
            const stateJs = state.toJS();
			const lastPage = Math.ceil(stateJs.count / stateJs.take);
			const newSkip = lastPage > 0 ? (lastPage-1)*stateJs.take : 0;
			return state.merge({ skip: newSkip });
		}

		case GO_TO_NEXT_PAGE: {
            const stateJs = state.toJS();
			const newSkip = stateJs.skip + stateJs.take;
			if (newSkip > state.count) {
				return state;
			}
			return state.merge({ skip: newSkip });
		}

		case GO_TO_PREVIOUS_PAGE: {
            const stateJs = state.toJS();
			const newSkip = stateJs.skip - stateJs.take;
			if (newSkip < 0) {
				return state;
			}
			return state.merge({ skip: newSkip });
		}
	}
	return state;
};

export class View extends Component<IViewProperties, {}> {

    constructor() {
        super();
        this.onFirst = this.onFirst.bind(this);
        this.onPrevious = this.onPrevious.bind(this);
        this.onNext = this.onNext.bind(this);
        this.onLast = this.onLast.bind(this);
    }

    onFirst() {
        this.props.dispatch(action(GO_TO_FIRST_PAGE));
    }

    onPrevious() {
        this.props.dispatch(action(GO_TO_PREVIOUS_PAGE));
    }

    onNext() {
        this.props.dispatch(action(GO_TO_NEXT_PAGE));
    }

    onLast() {
        this.props.dispatch(action(GO_TO_LAST_PAGE));
    }

    onPageSize(pageSize: number) {
        this.props.dispatch(action(CHANGE_PAGE_SIZE, pageSize));
    }

    render() {
        const {
            skip,
            take,
            count,
            pageSizes = [20, 50, 100, 200]
        } = this.props.model.toJS();

        const from = skip + 1;
        let to = skip + take;
        if (to > count) {
            to = count;
        }

        return (
            <div className="pager-component">
                <ul className="pager-component-pagination pagination">
                    <li><a href="#" onClick={this.onFirst}>&lt; &lt; </a></li>
                    <li><a href="#" onClick={this.onPrevious}>&lt; </a></li>
                    <li><span className="pagination-info">{from}-{to}/{count}</span></li>
                    <li><a href="#" onClick={this.onNext}>&gt; </a></li>
                    <li><a href="#" onClick={this.onLast}>&gt; &gt; </a></li>
                </ul>
                <select onChange={(e: any) => this.onPageSize(parseInt(e.target.value, 10)) } value={take.toString() }>
                    {pageSizes.map(i => (
                        <option key={i} value={i.toString() }>{i}</option>
                    )) }
                </select>
            </div>
        )
    }
}

export const effects = {
    html: View
}