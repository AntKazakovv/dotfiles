import {INotificationsConfig} from 'wlc-engine/modules/core/system/interfaces/base-config/notifications.interface';

export const notificationsConfig: INotificationsConfig = {
    useModals: false,
    zIndex: 1200,
    defaultDismissTime: 15_000,
    notificationsPerBreakpoint: {
        0: 1,
        1200: 2,
        1366: 3,
        1680: 4,
    },
};
