import {
    ILoyalty,
    ILoyaltyUpdate,
} from 'wlc-engine/modules/core/system/interfaces/loyalty.interface';

export interface ILoyaltyConfig {
    loyalty?: {
        /**
         * Change loyalty-program & loyalty-info title
        */
        programTitle?: string;
        /**
         * Path to levels images.
         */
        iconsDirPath?: string;
        /**
         * Extenstion of levels images(.png, .svg, .jpg ...).
         */
        iconsExtension?: string;
        /**
         * Path to image will be shown if primary image isn't loaded
         */
        iconFallback?: string;
    },
};

export interface IWSLoyalty {
    data: ILoyalty | ILoyaltyUpdate,
    event: string,
    status: string,
    requestId: number,
    system: string,
}
