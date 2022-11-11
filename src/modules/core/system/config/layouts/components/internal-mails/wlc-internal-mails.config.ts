import {ILayoutComponent} from 'wlc-engine/modules/core';
import {wlcTitle} from 'wlc-engine/modules/core/system/config/layouts/components/core/wlc-title.config';

export namespace wlcInternalMails {
    export const mails: ILayoutComponent = {
        name: 'internal-mails.wlc-internal-mails',
    };

    export const filter: ILayoutComponent = {
        name: 'core.wlc-wrapper',
        params: {
            class: 'profile-history-filter',
            components: [
                wlcTitle.profileV2,
                {
                    name: 'core.wlc-history-filter',
                    params: {
                        config: 'mails',
                    },
                    display: {
                        before: 1023,
                    },
                },
            ],
        },
    };

    export const filterOnly: ILayoutComponent = {
        name: 'core.wlc-history-filter',
        params: {
            config: 'mails',
        },
        display: {
            before: 1023,
        },
    };

    export const notifier: ILayoutComponent = {
        name: 'internal-mails.wlc-internal-mails-notifier',
        display: {
            after: 1200,
            auth: true,
        },
    };
}
