import {IDeviceConfig} from 'wlc-engine/modules/core/system/models/device.model';
import {IGamesConfig} from './games.interface';
import {IProfileСonfig} from './profile.interface';
import {ITournamentsConfig} from './tournaments.interface';

export interface IBaseConfig {
    profile: IProfileСonfig,
    tournaments: ITournamentsConfig,
    games: IGamesConfig,
    device: IDeviceConfig,
}
