import {Injectable} from '@angular/core';
import {
    StateObject,
    RawParams,
} from '@uirouter/core';

import _includes from 'lodash-es/includes';
import _findLast from 'lodash-es/findLast';

export interface IState {
    state: StateObject,
    params: RawParams,
}

@Injectable()
export class StateHistoryService {
    protected visitedStates: string[] = [];

    private states: IState[] = [];
    private readonly maxStatesLength = 5;

    public setState(state: StateObject, params: RawParams): void {
        this.states.push({
            state,
            params,
        });

        if (this.states.length > this.maxStatesLength) {
            this.states.shift();
        }
    }

    public getPreviousState(): IState {
        return this.states[this.states.length - 2];
    }

    public getCurrentState(): IState {
        return this.states[this.states.length - 1];
    }


    /**
     * Push state name in array visitedStates
     *
     * @param state StateDeclaration
     */
    public setFirstVisit(stateName: string): void {
        if (!_includes(this.visitedStates, stateName)) {
            this.visitedStates.push(stateName);
        }
    }

    /**
     * Return `true` if name not include in array visitedStates
     *
     * @param stateName string
     */
    public checkFirstVisit(stateName: string): boolean {
        return !_includes(this.visitedStates, stateName);
    }

    /**
     * Returns state and params from which the transition was made to GamePlay States
     * @returns IPrevState
     */
    public get lastNotGamePlayState(): IState {
        return _findLast(this.states, (stateInfo): boolean => {
            return !_includes(['app.gameplay', 'app.run-game'], stateInfo.state.name);
        });
    }
}
