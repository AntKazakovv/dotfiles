import {RawParams} from '@uirouter/core';

import {BehaviorSubject} from 'rxjs';

import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    TAnimationType,
    TAnimateButtonHandler,
} from 'wlc-engine/modules/core/system/interfaces/animate-buttons.interface';

export type Type = 'default' | 'resolved' | 'rejected' | 'pending' | 'disabled' | CustomType;
export type Theme = 'default' | 'skew' | 'rounding' | 'circled' | 'borderless' | 'icon' | 'cleared' | 'resolve'
    | CustomType;
export type Size = 'default' | 'small' | 'big' | CustomType;
export type ThemeMod = 'default' | 'secondary' | 'readmore' | 'textonly' | CustomType;
export type Index = number | string | null;
export type AutoModifiers = Theme | Size | ThemeMod | 'loading';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TButtonAnimation = {
    /** Animation type */
    type: TAnimationType;
    /** Button animate handler type */
    handlerType: TAnimateButtonHandler;
}
export type EventType = {
    name: string;
    data?: unknown;
}

export interface IButtonCParams extends IComponentParams<Theme, Type, ThemeMod> {
    modifiers?: Modifiers[];
    /** BehaviorSubject to pending status */
    pending$?: BehaviorSubject<boolean>,
    /** Pending status icon path */
    pendingIconPath?: string;
    common?: {
        size?: Size;
        icon?: string;
        iconPath?: string;
        index?: Index;
        text?: string;
        customModifiers?: CustomMod;
        event?: EventType | EventType[];
        /** href link for button */
        href?: string;
        sref?: string;
        srefParams?: RawParams;
        typeAttr?: string;
        wlcElement?: string;
        /** Set animation to button */
        animation?: TButtonAnimation;
        selectorScroll?: string;
    };
}

export const defaultParams: IButtonCParams = {
    moduleName: 'core',
    componentName: 'wlc-button',
    class: 'wlc-btn',
    pendingIconPath: 'wlc/icons/button-pending.svg',
    common: {
        size: 'default',
    },
};
