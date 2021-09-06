import {Injectable} from '@angular/core';

import _includes from 'lodash-es/includes';

@Injectable()
export class StateHistoryService {
    protected visitedStates: string[] = [];

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
}
