import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {TObjectFit} from './message.interface';

export type TTheme = 'default' | CustomType;
export type TMessageType = 'info' | 'success' | 'warning' | 'error';
export type TThemeMode = 'default' | CustomType;
export type TTypeIconsDictionary = {[K in TMessageType]?: string};

export interface IMessageParams extends IComponentParams<TTheme, TMessageType, TThemeMode> {
    showCloseButton?: boolean;
    imageFit?: TObjectFit;
    typeIcons?: TTypeIconsDictionary;
}

export const defaultParams: IMessageParams = {
    class: 'wlc-notification-message',
    componentName: 'wlc-notification-message',
    moduleName: 'core',
    type: 'info',
    showCloseButton: true,
    imageFit: 'cover',
    typeIcons: {
        success: 'status/ok',
        warning: 'status/alert',
        error: 'status/alert',
    },
};
