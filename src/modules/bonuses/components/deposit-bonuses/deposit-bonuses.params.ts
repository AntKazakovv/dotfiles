import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {IBonusItemCParams} from 'wlc-engine/modules/bonuses/components/bonus-item/bonus-item.params';
import {IBlankBonusParams} from 'wlc-engine/modules/bonuses/components/bonuses-list/bonuses-list.params';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | 'swiper' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface IDepositBonusesCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Filter for bonuses. Includes bonuses with events:
     * 'deposit', 'deposit first', 'deposit repeated', 'deposit sum'
     */
    filter?: 'deposit',
    /**
     * Params for bonus-item
     */
    itemParams?: IBonusItemCParams;
    /**
     * Blank bonus settings
     */
    blankBonus?: {
        /**
         * If not defined - used `bonus` with the bonus grid,
         * and as the `checkbox` with the swiper.
         *
         * `bonus` - creates empty bonus at the end of list. By
         *
         * TODO: in plans adding `checkbox`
         */
        type?: 'bonus',
        /**
         * Params for empty bonus
         */
        bonusParams?: IBlankBonusParams;
    };
    /**
     * Media query, which describes where the list of elements switch to the modal button.
     */
    asModal?: string,
    /**
     * Params for modal button, which open list of bonuses
     */
    modalBtnParams?: {
        /**
         * Title of button (visible if the bonus is not selected)
         */
        title?: string;
        /**
         * Subtitle of button (visible if the bonus is not selected)
         */
        subtitle?: string;
        /**
         * Icon path (visible if the bonus is not selected)
         */
        icon?: string;
        /**
         * Text on button (visible if the bonus is selected)
         */
        notEmptyTitle?: string;
    };

};

export const defaultParams: IDepositBonusesCParams = {
    class: 'wlc-deposit-bonuses',
    componentName: 'wlc-deposit-bonuses',
    moduleName: 'bonuses',
    filter: 'deposit',
    asModal: '(max-width: 479px)',
    modalBtnParams: {
        icon: 'wlc/icons/empty-bonus.svg',
        title: gettext('Select a bonus.'),
        subtitle: gettext('Receive additional spins or money with your deposit.'),
        notEmptyTitle: gettext('Show all bonuses'),
    },
    itemParams: {
        theme: 'mini',
        common: {
            nameClamp: 2,
        },
        bonusModalParams: {
            hideBonusButtons: true,
        },
    },
};

export const defBlankBonusParams: IBlankBonusParams = {
    id: null,
    name: gettext('I don`t want a bonus.'),
    isChoose: true,
};
