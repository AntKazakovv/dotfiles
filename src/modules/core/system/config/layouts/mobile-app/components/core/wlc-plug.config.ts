import {ILayoutComponent} from 'wlc-engine/modules/core';

export namespace wlcPlug {
    export const tournaments: ILayoutComponent = {
        name: 'core.wlc-plug',
        params: {
            label: gettext('Tournaments'),
            title: gettext('Coming soon'),
            description: gettext('This block is not yet available, but it will appear soon.'),
        },
    };
}
