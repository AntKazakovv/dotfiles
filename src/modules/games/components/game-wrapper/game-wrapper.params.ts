import {IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ICustomGameParams} from '../../system/interfaces/games.interfaces';

export interface IGameWrapperCParams extends IComponentParams<string, string, string> {
    updateOnWindowResize?: boolean;
    padding?: number;
    gameParams: ICustomGameParams;
}

export const defaultParams: IGameWrapperCParams = {
    class: 'wlc-game-wrapper',
    updateOnWindowResize: true,
    padding: 0,
    gameParams: undefined,
};
