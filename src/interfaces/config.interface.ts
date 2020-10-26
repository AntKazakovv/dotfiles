export interface IDefaultConfig {
    replaceConfig?: boolean;
}

export interface ISvgIcons {
    [key: string]: string;
}

export interface IComponentParams<T, R> {
    class?: string;
    modifiers?: string[];
    theme?: 'theme-default' | T;
    type?: R;
}
