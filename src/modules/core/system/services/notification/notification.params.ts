import {CustomType, IComponentParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type TTheme = 'top' | 'bottom' | CustomType;
export type TType = 'default' | CustomType;
export type TThemeMod = 'left' | 'center' | 'right' | CustomType;

export interface INotificationParams extends IComponentParams<TTheme, TType, TThemeMod> {

    /**
     * @description
     * Defines notification thread z-index
     *
     * @default 1060
     */
    zIndex?: number;

    /**
     * Record that determines number of notifications that
     * could be shown at once
     *
     * Key stands for min-width and value for notifications amount
     *
     * @example
     * ```typescript
     * {
     *   900: 3, // show 3 notifications at max on screen wider then 900px
     * }
     * ```
     *
     * @default
     * ```typescript
     * {
     *   0: 1,
     *   900: 2,
     *   1200: 3,
     *   1680: 4,
     * }
     * ```
     */
    notificationsPerBreakpoint?: Record<number, number>;

    /**
     * Default dismiss time in ms
     *
     * @default 15000
     */
    defaultDismissTime?: number;
}

export const defaultParams: INotificationParams = {
    moduleName: 'core',
    componentName: 'wlc-notification-thread',
    class: 'wlc-notification-thread',
    theme: 'bottom',
    themeMod: 'right',
    zIndex: 1060,
    defaultDismissTime: 15000,
    notificationsPerBreakpoint: {
        0: 1,
        900: 2,
        1200: 3,
        1680: 4,
    },
};
