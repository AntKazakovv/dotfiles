import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
export interface IGameThumbCParams extends IComponentParams<string, string, string> {}

export const defaultParams: IGameThumbCParams = {
    moduleName: 'games',
    componentName: 'game-thumb',
    class: 'wlc-game-thumb',
};
