import {
    IAccordionCParams,
    IComponentParams,
    CustomType,
    IWrapperCParams,
    IAccordionData,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/modules/games';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {Theme as BonusItemTheme} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IBonusModalCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /** Object "Bonus" */
    bonus?: Bonus;
    /** Bonus item theme */
    bonusItemTheme?: BonusItemTheme;
    /** If `true` - hides bonus buttons component */
    hideBonusButtons?: boolean;
    /** Object accordion params */
    accordionParams?: IAccordionCParams,
    /** Params for accordion with games */
    gamesAccordionParams?: IAccordionCParams;
    /** Params of games accordion item (title, description, etc.) */
    gamesCommon?: IAccordionData;
    /** Params of games accordion item (title, description, etc.) */
    freeroundGamesCommon?: IAccordionData;
    /** Params for games grid */
    gamesGridWrapperParams?: IWrapperCParams;
}

export const defaultParams: IBonusModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-modal',
    class: 'wlc-bonus-modal',
    gamesAccordionParams: {
        themeMod: 'simple',
        items: [],
    },
    gamesCommon: {
        title: gettext('Games with bonus'),
        description: gettext('Games in which you can wager a bonus'),
    },
    freeroundGamesCommon: {
        title: gettext('Free rounds'),
        description: gettext('Games in which you will receive Free rounds'),
    },
    /** Use games grid only inside wrapper component */
    gamesGridWrapperParams: {
        components: [
            {
                name: 'games.wlc-games-grid',
                params:<IGamesGridCParams> {
                    themeMod: 'simple',
                    gamesRows: 2,
                    usePlaceholders: true,
                    showTitle: false,
                    mobileSettings: {
                        gamesRows: 3,
                    },
                    thumbParams: {
                        type: 'simple',
                    },
                    btnLoadMore: {
                        themeMod: 'textonly',
                    },
                },
            },
        ],
    },
};
