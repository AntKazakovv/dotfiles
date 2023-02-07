import {Injectable} from '@angular/core';
import {
    StateObject,
    RawParams,
} from '@uirouter/core';

import _includes from 'lodash-es/includes';
import _find from 'lodash-es/find';
import _reverse from 'lodash-es/reverse';

export interface IState {
    state: StateObject,
    params: RawParams,
}

@Injectable()
export class StateHistoryService {
    protected visitedStates: string[] = [];

    private _lastNotGamePlayState: IState = null;
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
        return _find(_reverse(this.states), (stateInfo): boolean => {
            return !_includes(['app.gameplay', 'app.run-game'], stateInfo.state.name);
        });
    }
}
