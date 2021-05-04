import {MenuConfigItem} from 'wlc-engine/modules/menu/components/menu/menu.params';

export interface IMenuIcons {
    folder?: string;
    use?: boolean;
}

export interface IMenuSettings {
    items?: MenuConfigItem[];
    icons?: IMenuIcons;
}

export interface IMobileMenuSettings extends IMenuSettings {
    categoryIcons?: IMenuIcons;
}

export interface IProfileMenuSettings extends IMenuSettings {
    subMenuIcons?: IMenuIcons;
    dropdownMenuIcons?: IMenuIcons;
}

export interface ICategoryMenuSettings extends IMenuSettings {
    lobbyBtn?: {
        use?: boolean;
    }
};

export interface IMenuConfig {
    mainMenu?: IMenuSettings;
    categoryMenu?: ICategoryMenuSettings;
    mobileMenu?: IMobileMenuSettings;
    profileMenu?: IProfileMenuSettings;
    profileFirstMenu?: IProfileMenuSettings;
}
