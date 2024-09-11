import {UntypedFormControl} from '@angular/forms';
import {
    CustomType,
    IComponentParams,
    ValidatorType,
    IIndexing,
} from 'wlc-engine/modules/core';
import {ThemeMod as TooltipThemeMod} from 'wlc-engine/modules/core/components/tooltip/tooltip.params';

export type ComponentTheme = 'default' | 'vertical' | 'mobile-app' | CustomType;
export type ComponentType = 'default' | CustomType;
export type Theme = 'default' | CustomType;
export type AutoModifiers = Theme | 'default';
export type CustomMod = string;
export type Modifiers = AutoModifiers | CustomMod | null;
export type TComponentsWithIcon = 'phoneCode' | 'countryCode' | 'currency';
export type TAliasesType = 'countries';

export interface ISelectCParams<V = unknown>
extends IComponentParams<ComponentTheme, ComponentType, string>, IDeepSearch {
    name: string;
    value?: V;
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
    autocomplete?: string;
    validators?: ValidatorType[];
    control?: UntypedFormControl;
    disabled?: boolean;
    locked?: boolean | string[];
    labelText?: string;
    options?: string;
    items?: ISelectOptions<V>[];
    modifiers?: Modifiers[];
    useSearch?: boolean;
    insensitiveSearch?: boolean;
    noResultText?: string;
    autoSelect?: boolean;
    useIcon?: boolean;
    /**
     *  Don't close the dropdown on the touchStart event.
     */
    disableTouchStart?: boolean;
    /**
     * Update value if control has been changed from outside
     */
    updateOnControlChange?: boolean;
}

export interface ISelectOptions<V = unknown> extends ILevenshteinDistance {
    value: V;
    title: string | number;
    /**
     * Path by country flag. For show country flags.
     * Need to enable config $modules.user.formElements.showIcon
     */
    icon?: string;
    note?: string;
    context?: IIndexing<string>;
}

export interface ISelectOptionsWithIcon {
    use: boolean;
    components: TComponentsWithIcon[];
}
export interface IAlias {
    aliases: string[],
    title: string,
    value: string
};

export interface ILevenshteinDistance {
    /**
     * Levenshtein distance. Need for smart search if user made mistake.
     */
    distance?: number;
}

export interface IDeepSearch {
    deepSearch?: {
        use?: boolean;
        aliasesType?: TAliasesType;
        searchLimit?: number;
    }
}

export const defaultParams: Partial<ISelectCParams> = {
    class: 'wlc-select',
    noResultText: gettext('No results available'),
    autocomplete: 'off',
    disableTouchStart: true,
};
