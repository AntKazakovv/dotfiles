import {ILayoutSectionConfig} from 'wlc-engine/modules/core/system/interfaces';
import * as componentLib from '../components';

export namespace lotteries {
    export const lotteryCard: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.lotteries.lotteryCard,
        ],
        smartSection: {
            hostClasses: 'wlc-mb-xl',
        },
    };

    export const lotteryDetail: ILayoutSectionConfig = {
        container: true,
        components: [
            componentLib.lotteries.lotteryDetail,
        ],
        smartSection: {
            hostClasses: 'wlc-mb-xl',
        },
    };
}
