import {IIndexing} from './global.interface';

export interface ILoyaltyConfig {
    useForbidUserFields: boolean;
    forbidBanned: IIndexing<IForbidBanned>;
}

export interface IForbidBanned {
    forbidBonuses?: boolean;
    forbidLoyaltyPoints?: boolean;
    forbidTournaments?: boolean;
}
