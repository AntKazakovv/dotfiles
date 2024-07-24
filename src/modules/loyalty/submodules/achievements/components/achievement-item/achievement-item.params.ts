import {
    CustomType,
    IAccordionCParams,
    IAccordionData,
    IButtonCParams,
    IComponentParams,
} from 'wlc-engine/modules/core';
import {AchievementModel} from 'wlc-engine/modules/loyalty/submodules/achievements/system/models/achievement.model';
import {
    IAchievementItemParams,
    TAchievementTarget,
    TItemModalTheme,
} from 'wlc-engine/modules/loyalty/submodules/achievements/system/interfaces/achievement.interface';

export type Theme = 'default' | 'wolf' | TItemModalTheme | CustomType;
export type Type = 'default' | CustomType;
export type ThemeMod = 'default' | CustomType;

export interface IAchievementItemCParams extends IComponentParams<Theme, Type, ThemeMod> {
    /**
     * Achievement model
     */
    achievement?: AchievementModel;
    /**
     * Button params for different achievement targets
     */
    buttonParams?: Partial<Record<TAchievementTarget, IButtonCParams>>;
    /**
     * Show progress in achievement
     */
    showProgress?: boolean;
    /**
     * Prize icon in top right angle
     */
    prizeIconPath?: string;
    /**
     * Info icon path
     */
    itemParams?: IAchievementItemParams,
    generateCaptionFn?: (achievement: AchievementModel) => string,
    levelsAccordionParams?: IAccordionCParams;
    levelsAccordionItemParams?: IAccordionData;
}

export const defaultParams: IAchievementItemCParams = {
    moduleName: 'achievements',
    componentName: 'wlc-achievement-item',
    class: 'wlc-achievement-item',
    buttonParams: {
        Bet: {
            theme: 'cleared',
            common: {
                text: 'Play',
                sref: 'app.catalog',
                srefParams: {
                    category: 'casino',
                },
            },
            wlcElement: 'button_play',
        },
        Deposit: {
            theme: 'cleared',
            common: {
                text: 'Deposit',
                sref: 'app.profile.cash.deposit',
            },
            wlcElement: 'button_deposit',
        },
        GroupWins: {
            theme: 'cleared',
            common: {
                text: 'Play',
                sref: 'app.catalog',
                srefParams: {
                    category: 'casino',
                },
            },
            wlcElement: 'button_play',
        },
        Verification: {
            theme: 'cleared',
            common: {
                text: gettext('Verify'),
                sref: 'app.profile.main.info',
            },
            wlcElement: 'button_verify',
        },
        Win: {
            theme: 'cleared',
            common: {
                text: 'Play',
                sref: 'app.catalog',
                srefParams: {
                    category: 'casino',
                },
            },
            wlcElement: 'button_play',
        },
        Withdrawal: {
            theme: 'cleared',
            common: {
                text: 'Withdrawal',
                sref: 'app.profile.cash.withdraw',
            },
            wlcElement: 'button_withdraw',
        },
        Empty: {
            theme: 'cleared',
            common: {/* filled in code */},
            wlcElement: 'button_empty',
        },
    },
    prizeIconPath: 'wlc/achievements/prizeIcon.svg',
    showProgress: true,
    generateCaptionFn: (achievement: AchievementModel): string => {
        return `LVL ${achievement.progressCurrent + 1}/${achievement.progressTotal}`;
    },
    levelsAccordionParams: {
        theme: 'wolf',
    },
    levelsAccordionItemParams: {
        title: gettext('Information'),
        expand: true,
    },
};
