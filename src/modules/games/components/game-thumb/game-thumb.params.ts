import {IComponentParams} from 'wlc-engine/classes/abstract.component';
export interface IGTParams extends IComponentParams<string, string, string> {
}

export const defaultParams: IGTParams = {
    moduleName: 'games',
    componentName: 'game-thumb',
    class: 'wlc-game-thumb',
};
