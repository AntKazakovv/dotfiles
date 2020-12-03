import {defaultParams} from './menu.params';
import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';

import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector, Input,
    OnInit, SimpleChanges,
} from '@angular/core';
import {AbstractComponent, IMixedParams} from 'wlc-engine/classes/abstract.component';
import {MenuHelper} from 'wlc-engine/modules/menu/helpers/menu.helper';
import {
    LayoutService,
    ActionService, EventService,
} from 'wlc-engine/modules/core/services';
import {
    ModalService,
} from 'wlc-engine/modules/core/services';

@Component({
    selector: '[wlc-menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./styles/menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent extends AbstractComponent implements OnInit {
    public items: Params.IMenuItem[];
    public $params: Params.IMenuCParams;

    @Input() protected inlineParams: Params.IMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
        protected actionService: ActionService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.IMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this.initItems();
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.initItems();
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

    protected initItems(): void {
        this.items = MenuHelper.getItems(
            {
                items: this.$params.items,
                type: this.$params.type,
            },
        );
        this.cdr.markForCheck();
    }
}
