import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {MenuHelper} from 'wlc-engine/modules/menu/helpers/menu.helper';
import {
    LayoutService,
    ActionService,
} from 'wlc-engine/modules/core/services';
import {
    ModalService,
} from 'wlc-engine/modules/core/services';

import * as Params from './menu.params';

@Component({
    selector: '[wlc-menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./styles/menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent extends AbstractComponent implements OnInit {
    public items: Params.IMenuItem[];
    public $params: Params.IMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
        protected actionService: ActionService,
        protected modalService: ModalService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.items = MenuHelper.getItems(
            {
                items: this.$params.items,
                type: this.$params.type,
            },
        );
        this.cdr.markForCheck();
    }

    public scrollTo(selector: string): void {
        this.actionService.scrollTo(selector);
    }

    public async openModal(item: Params.IMenuItemParamsModal) {
        const component: any = await this.layoutService.loadComponent(item.params.modal.name);

        if (component) {
            this.modalService.showModal({
                id: 'static-text',
                component: component,
                componentParams: {
                    slug: item.params.modal.params.slug,
                },
                modifier: 'info',
                modalTitle: 'Loading...',
                scrollable: true,
                size: 'lg',
            });
        }
    }
}
