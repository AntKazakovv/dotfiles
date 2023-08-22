import {ILoyalty} from 'wlc-engine/modules/core/system/interfaces/loyalty.interface';

export interface ILoyaltyConfig {
    loyalty?: {
        /**
         * Change loyalty-program & loyalty-info title
        */
        programTitle?: string;
    },
};

export interface IWSLoyalty {
    data: ILoyalty,
    event: string,
    status: string,
    requestId: number,
    system: string,
}
