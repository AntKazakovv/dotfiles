import {MenuConfigItem} from 'wlc-engine/modules/menu/components/menu/menu.params';

export interface IMobileConfig {
    sidebarMenu?: ISidebarMenuSettings;
}

export interface ISidebarMenuSettings {
    items: MenuConfigItem[][];
}
