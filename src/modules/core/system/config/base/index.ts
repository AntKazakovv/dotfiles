import {IBaseConfig} from 'wlc-engine/modules/core/system/interfaces/base-config';
import {deviceConfig} from './device.config';
import {profileConfig} from './profile.config';
import {tournamentsConfig} from './tournaments.config';
import {gamesConfig} from './games.config';
import {appConfig} from './app.config';

export const $base: IBaseConfig = {
    app: appConfig,
    device: deviceConfig,
    profile: profileConfig,
    tournaments: tournamentsConfig,
    games: gamesConfig,
};

