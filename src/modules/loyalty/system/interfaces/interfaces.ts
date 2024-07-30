import {BehaviorSubject, Subject} from 'rxjs';
import {Bonus} from 'wlc-engine/modules/bonuses';
import {
    ILoyalty,
    ILoyaltyUpdate,
} from 'wlc-engine/modules/core/system/interfaces/loyalty.interface';
import {ISelectedWallet} from 'wlc-engine/modules/multi-wallet';
import {StoreItem} from 'wlc-engine/modules/store';
import {Tournament} from 'wlc-engine/modules/tournaments';

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

export interface IAmount {
    currency: string;
    value: number | string;
}

export type TLoyaltyItem = Bonus | StoreItem | Tournament;

export interface ILoyaltySubscribeController {
    debitAmount: IAmount[];
    creditAmount: IAmount[];
    wallet$: BehaviorSubject<ISelectedWallet>;
    model: TLoyaltyItem;
    init(
        model: TLoyaltyItem,
        $destroy: Subject<void>,
        wallet$: BehaviorSubject<ISelectedWallet>,
    ): void;
    subscribe(): void;
}
