import {IComponentParams} from 'wlc-engine/classes/abstract.component';

export type ButtonTheme = 'default' | 'secondary' | 'accent' | 'warn' | 'danger' | 'link' | 'text';
export type ButtonSize = 'size-large' | 'size-default' | 'size-small';
export type ButtonIndex = number | string | null;
export type AutoModifiersType = ButtonTheme | ButtonSize | 'loading';
export type ManualModifiersType = string;
export type ModifiersType = AutoModifiersType | ManualModifiersType | null;

export interface IBParams extends IComponentParams<ButtonTheme, string> {
    modifiers?: ModifiersType[];
    theme?: ButtonTheme;
    common?: {
        size?: ButtonSize;
        icon?: string;
        loading?: boolean;
        disabled?: boolean;
        index?: ButtonIndex;
        text?: string;
        additionalModifiers?: ManualModifiersType;
    };
}

export const defaultParams: IBParams = {
    class: 'wlc-btn',
    common: {
        size: 'size-default',
    },
};
