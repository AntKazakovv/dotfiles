import {ThemeType} from "wlc-engine/modules/base/components/language-selector/language-selector.params";

export interface IDefaultConfig {
    replaceConfig?: boolean;
}

export interface ISvgIcons {
    [key: string]: string;
}

export interface IComponentParams {
    class?: string;
    modifiers?: string[];
    theme?: string;
}
