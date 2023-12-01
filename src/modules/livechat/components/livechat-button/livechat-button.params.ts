import {
    IComponentParams,
    CustomType,
} from 'wlc-engine/modules/core';
import {TFixedPanelPos} from 'wlc-engine/modules/core/system/interfaces/base-config/fixed-panel.interface';

export type ComponentTheme = 'default' | CustomType;
export type ComponentType = 'default' | CustomType;
export type ComponentThemeMod = 'default' | CustomType;

export interface ILivechatButtonCParams extends IComponentParams<ComponentTheme, ComponentType, ComponentThemeMod> {
    /**
     * Set to true if default widget button is to be hidden while this button exists.
     */
    replaceDefault?: boolean;
    /**
     * Text on button
     */
    buttonText?: string;
    /**
     * Path for icon
     */
    iconPath?: string;
    fixedPanelPosition?: TFixedPanelPos;
    compactMod?: boolean;
};

export const defaultParams: ILivechatButtonCParams = {
    class: 'wlc-livechat-button',
    componentName: 'wlc-livechat-button',
    moduleName: 'livechat',
    replaceDefault: true,
    buttonText: gettext('Live Chat'),
    iconPath: 'wlc/icons/livechat_new.svg',
    fixedPanelPosition: 'left',
    compactMod: false,
};
