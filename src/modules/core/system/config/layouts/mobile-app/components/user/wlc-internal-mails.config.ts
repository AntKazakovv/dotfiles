import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcInternalMails {
    export const mails: ILayoutComponent = {
        name: 'internal-mails.wlc-internal-mails',
    };

    export const notifier: ILayoutComponent = {
        name: 'internal-mails.wlc-internal-mails-notifier',
        display: {
            after: 1200,
            auth: true,
        },
    };
}
