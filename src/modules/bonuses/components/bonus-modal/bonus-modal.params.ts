import {
    IAccordionCParams,
    IComponentParams,
    CustomType,
    IWrapperCParams,
    IAccordionData,
    ITextBlockCParams,
    IFormWrapperCParams,
} from 'wlc-engine/modules/core';
import {IGamesGridCParams} from 'wlc-engine/standalone/games/components/games-grid/games-grid.params';
import {Bonus} from 'wlc-engine/modules/bonuses/system/models/bonus/bonus';
import {Theme as BonusItemTheme} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {IAlertCParams} from 'wlc-engine/modules/core/components/alert/alert.params';
import {IBonusWagerCParams} from 'wlc-engine/modules/bonuses/components/bonus-wager/bonus-wager.params';

export type Type = 'default' | CustomType;
export type Theme = 'default' | 'wolf' | CustomType;
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
    /** Possible rewards accordion params */
    rewardsParams?: IAccordionCParams;
    /** Param to pass alert into bonus-modal */
    alerts?: IAlertCParams[];
    wagerParams?: IBonusWagerCParams;
    /** Accordion text for sport bonus */
    sportBonusAccordionText?: IFormWrapperCParams;
}

export const defaultParams: IBonusModalCParams = {
    moduleName: 'bonuses',
    componentName: 'wlc-bonus-modal',
    class: 'wlc-bonus-modal',
    gamesAccordionParams: {
        themeMod: 'simple',
        items: [],
        titleIconPath: '/wlc/icons/arrow-new.svg',
    },
    gamesCommon: {
        title: gettext('Games with bonus'),
        description: gettext('Games in which you can wager the bonus'),
    },
    freeroundGamesCommon: {
        title: gettext('Free spins'),
        description: gettext('Games in which you will receive Free spins'),
    },
    /** Use games grid only inside wrapper component */
    gamesGridWrapperParams: {
        components: [
            {
                name: 'games.wlc-games-grid',
                params: <IGamesGridCParams>{
                    theme: 'default',
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
                        theme: 'textonly',
                    },
                },
            },
        ],
    },
    rewardsParams: {
        title: gettext('Possible rewards'),
        titleIconPath: '/wlc/icons/arrow-new.svg',
        collapseAll: true,
    },
    wagerParams: {
        theme: 'simple',
    },
    sportBonusAccordionText: {
        components: [
            {
                name: 'core.wlc-text-block',
                params: <ITextBlockCParams>{
                    common: {
                        textBlockText: gettext('The bonus can be wagered only by making bets on sporting events'),
                    },
                },
            },
        ],
    },
};
