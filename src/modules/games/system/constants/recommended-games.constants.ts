import {
    IIndexing,
    IStorageType,
} from 'wlc-engine/modules/core';

export const dontShowRecommendedGames = 'game-recommended-dont-show';

export const dontShowRecommendedGamesStorage: IStorageType = 'localStorage';

export const zingBrainCategoryMap: IIndexing<string> = {
    new: 'new',
    recommendations: 'zing-main-recommended',
    'similar-recommended': 'zing-pop-up-similar-games',
};
