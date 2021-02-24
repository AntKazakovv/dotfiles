import {MenuConfigItem} from 'wlc-engine/modules/menu/components/menu/menu.params';

export interface IMenuSettings {
    items?: MenuConfigItem[];
    icons?: {
        folder?: string;
        use?: boolean;
    }
}

export interface IMobileMenuSettings extends IMenuSettings {
    categoryIcons: {
        folder?: string;
        use?: boolean;
    }
};

export interface ICategoryMenuSettings extends IMenuSettings {
    lobbyBtn?: {
        use?: boolean;
    }
};

export interface IMenuConfig {
    mainMenu?: IMenuSettings;
    categoryMenu?: ICategoryMenuSettings;
    mobileMenu?: IMobileMenuSettings;
    profileMenu?: IMenuSettings;
}
