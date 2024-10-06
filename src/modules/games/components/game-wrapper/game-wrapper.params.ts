import {IGameWrapperCParams} from 'wlc-engine/modules/games/components/game-wrapper/game-wrapper.interfaces';

export const defaultParams: IGameWrapperCParams = {
    moduleName: 'games',
    componentName: 'wlc-game-wrapper',
    class: 'wlc-game-wrapper',
    theme: 'default',
    themeMod: 'default',
    type: 'default',
    updateOnWindowResize: true,
    padding: 20,
    gameParams: {
        minGameWindowHeight: 250,
    },
    wlcElement: 'section_game-play-container',
    dashboardSide: 'right',
    calcWidth: true,
};
