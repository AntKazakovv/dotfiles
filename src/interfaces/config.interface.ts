export interface IDefaultConfig {
    replaceConfig?: boolean;
}

export interface ISvgIcons {
    [key: string]: string;
}

export type Custom = 'custom';

export interface IComponentParams<T, R, M> {
    class?: string;
    theme?: 'default' | T;
    type?: R;
    themeMod?: 'default' | M;
    customMod?: string | string[];
}
