import {FormControl} from '@angular/forms';
import {
    CustomType,
    IComponentParams,
    ValidatorType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {ThemeMod as TooltipThemeMod} from 'wlc-engine/modules/core/components/tooltip/tooltip.params';

export type ComponentTheme = 'default' | 'vertical' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;

export interface ISelectCParams extends IComponentParams<ComponentTheme, ComponentType, string> {
    name: string;
    value?: string;
    id?: string;
    common?: {
        placeholder?: string | number;
        customModifiers?: CustomMod;
        tooltipText?: string;
        tooltipIcon?: string;
        tooltipModal?: string;
        tooltipMod?: TooltipThemeMod;
        tooltipModalParams?: IIndexing<string>;
    },
    validators?: ValidatorType[];
    control?: FormControl;
    disabled?: boolean;
    locked?: boolean;
    labelText?: string;
    options?: string;
    items?: ISelectOptions[];
    modifiers?: Modifiers[];
    useSearch?: boolean;
    insensitiveSearch?: boolean;
    noResultText?: string;
    autoSelect?: boolean;
}

export interface ISelectOptions {
    value: unknown;
    title: string | number;
}

export const defaultParams: Partial<ISelectCParams> = {
    class: 'wlc-select',
    useSearch: true,
    insensitiveSearch: true,
    noResultText: gettext('No results available'),
};
