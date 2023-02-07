'use strict';

import {Ng2StateDeclaration} from '@uirouter/angular';
import {
    Transition,
} from '@uirouter/core';

import {
    ConfigService,
} from 'wlc-engine/modules/core';
import {StateHelper} from 'wlc-engine/modules/core/system/helpers/state.helper';
import {wlcSidebarMenuItemsGlobal} from 'wlc-engine/modules/mobile/system/config/sidebar-menu.config';
import {IMenuItem} from 'wlc-engine/modules/menu/components/menu/menu.params';

const itemResolver = {
    token: 'itemName',
    deps: [
        ConfigService,
        Transition,
    ],
    resolveFn: async (
        configService: ConfigService,
        transition: Transition,
    ) => {
        await configService.ready;

        const itemId: string = transition.targetState().params().item;
        const item: IMenuItem = wlcSidebarMenuItemsGlobal[`sidebar-menu:${itemId}`];

        if (item) {
            const state: Ng2StateDeclaration = transition.targetState().state();
            StateHelper.setStateData(state, 'itemName', item.name);
        }
    },
};

export const menuState: Ng2StateDeclaration = {
    url: '/menu',
};

export const menuItemState: Ng2StateDeclaration = {
    url: '/:item',
    resolve: [
        itemResolver,
    ],
};
