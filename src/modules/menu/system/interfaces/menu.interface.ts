import {MenuConfigItem} from 'wlc-engine/modules/menu/components/menu/menu.params';

export interface IMenuIcons {
    folder?: string;
    extension?: TIconExtension;
    use?: boolean;
}

export interface IMenuSettings {
    items?: MenuConfigItem[];
    icons?: IMenuIcons;
}

export interface IMobileMenuSettings extends IMenuSettings {
    categoryIcons?: IMenuIcons;
    disableCategories?: boolean;
}

export interface IProfileMenuSettings extends IMenuSettings {
    subMenuIcons?: IMenuIcons;
    dropdownMenuIcons?: IMenuIcons;
}

export interface ICategoryMenuSettings extends IMenuSettings {
    lobbyBtn?: {
        use?: boolean;
    }
}

export interface IAffiliatesMenuSettings {
    items?: MenuConfigItem[];
}

export interface IMenuConfig {
    mainMenu?: IMenuSettings;
    categoryMenu?: ICategoryMenuSettings;
    mobileMenu?: IMobileMenuSettings;
    profileMenu?: IProfileMenuSettings;
    profileFirstMenu?: IProfileMenuSettings;
    affiliatesMenu?: IAffiliatesMenuSettings;
}

export type TIconExtension = 'jpeg' | 'jpg' | 'gif' | 'png' | 'svg' | 'webp' | 'avif';
