export interface IDefaultConfig {
    replaceConfig?: boolean;
}

export interface ISvgIcons {
    [key: string]: string;
}

export type CustomType = 'custom';
export interface IComponentParams<T, R, M> {
    moduleName?: string;
    componentName?: string;
    wlcElement?: string;
    class?: string;
    theme?: 'default' | T;
    type?: R;
    themeMod?: 'default' | M;
    customMod?: string | string[];
}

export type ICounterType = 'bonuses-main' | 'bonuses-all' | 'store' | 'tournaments';
