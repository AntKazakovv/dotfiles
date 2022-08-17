import {
    MenuConfigItem,
} from 'wlc-engine/modules/menu/components/menu/menu.params';
import {
    IMenuItem,
} from 'wlc-engine/modules/core';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';

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
    fundistMenuSettings?: {
        itemsBefore?: IMenuItem[];
        itemsAfter?: IMenuItem[];
    }
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

export interface IBurgerPanelHeaderMenu {
    use?: boolean | 'auto',
    enableByFundistMenuSettings?: boolean,
    menuParams?: MenuParams.IMenuCParams;
    icons?: {
        folder: string;
    }
    items?: MenuConfigItem[];
}

export interface IMenuConfig {
    fundist?: IFundist;
    mainMenu?: IMenuSettings;
    mainMenuKiosk?: IMenuSettings;
    categoryMenu?: ICategoryMenuSettings;
    mobileMenu?: IMobileMenuSettings;
    profileMenu?: IProfileMenuSettings;
    profileFirstMenu?: IProfileMenuSettings;
    profileKioskMenu?: IProfileMenuSettings;
    affiliatesMenu?: IAffiliatesMenuSettings;
    burgerPanel?: {
        left?: {
            headerMenu?: IBurgerPanelHeaderMenu;
        },
        right?: {
            headerMenu?: IBurgerPanelHeaderMenu;
        }
    },
}

export interface IFundist {
    defaultMenuSettings: IFundistDefaultMenuSettings
}

export interface IFundistDefaultMenuSettings {
    use: boolean;
}

export type TIconExtension = 'jpeg' | 'jpg' | 'gif' | 'png' | 'svg' | 'webp' | 'avif';
