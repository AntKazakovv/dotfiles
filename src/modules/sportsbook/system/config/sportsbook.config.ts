import {ISportsbookConfig} from '../interfaces/sportsbook.interface';

export const sportsbookConfig: ISportsbookConfig = {
    betradar: {
        widgets: {
            dailyMatch: {
                imagesDir: '/games/betradar/widgets/daily-match',
            },
            popularEvents: {
                imagesDir: '/games/betradar/widgets/popular-events/v1',
            },
        },
    },
    merchantIdsForBonus: [958],
};
