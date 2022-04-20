import {Injectable} from '@angular/core';
import _includes from 'lodash-es/includes';
import {
    StateObject,
    RawParams,
} from '@uirouter/core';

export interface IPrevState {
    state: StateObject,
    params: RawParams,
}

@Injectable()
export class StateHistoryService {
    protected visitedStates: string[] = [];
    private _lastNotGamePlayState: IPrevState = null;

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
    public get lastNotGamePlayState() {
        return this._lastNotGamePlayState;
    }

    /**
     * Set state and params from which the transition was made to GamePlay States
     * @returns void
     * @param prevState IPrevState
     */
    public set lastNotGamePlayState(prevState: IPrevState) {
        this._lastNotGamePlayState = prevState;
    }
}
