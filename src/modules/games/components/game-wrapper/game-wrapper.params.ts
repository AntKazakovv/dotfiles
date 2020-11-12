import {IComponentParams} from 'wlc-engine/classes/abstract.component';
import {ICustomGameParams} from '../../interfaces/games.interfaces';

export interface IGWParams extends IComponentParams<string, string, string> {
    updateOnWindowResize?: boolean;
    padding?: number;
    gameParams: ICustomGameParams;
}

export const defaultParams: IGWParams = {
    class: 'wlc-game-wrapper',
    updateOnWindowResize: true,
    padding: 0,
    gameParams: undefined,
};
