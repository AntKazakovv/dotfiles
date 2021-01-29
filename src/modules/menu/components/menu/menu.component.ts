import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input, OnChanges,
    OnInit,
    SimpleChanges,
} from '@angular/core';
import {
    StateService,
    TransitionService,
} from '@uirouter/core';
import {
    animate,
    state,
    style,
    transition,
    trigger,
} from '@angular/animations';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {MenuHelper} from 'wlc-engine/modules/menu/system/helpers/menu.helper';
import {
    LayoutService,
    ActionService,
    ModalService,
} from 'wlc-engine/modules/core/system/services';
import * as Params from 'wlc-engine/modules/menu/components/menu/menu.params';
import {IMenuItemsGroup} from 'wlc-engine/modules/menu/components/menu/menu.params';

import {
    get as _get,
    forEach as _forEach,
} from 'lodash-es';

@Component({
    selector: '[wlc-menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./styles/menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('toggle', [
            state('opened', style({
                height: '*',
                opacity: 1,
                margin: '*',
                'pointer-events': 'initial',
            })),
            state('closed', style({
                height: '0px',
                opacity: 0,
                margin: 0,
                'pointer-events': 'none',
            })),
            transition('void => *', [
                animate(0),
            ]),
            transition('* => *', [
                animate('0.1s'),
            ]),
        ])],
})
export class MenuComponent extends AbstractComponent implements OnInit, OnChanges {
    public items: Params.MenuItemObjectType[];
    public $params: Params.IMenuCParams;

    @Input() protected inlineParams: Params.IMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
        protected actionService: ActionService,
        protected modalService: ModalService,
        protected stateSerivce: StateService,
        protected transitionService: TransitionService,
    ) {
        super(
            <IMixedParams<Params.IMenuCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            },
        );
    }

    public isActive(state: string): boolean {
        return this.stateSerivce.includes(state);
    }

    public toggleDropdown(item: Params.IMenuItemsGroup): void {
        item.expand = !item.expand;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        super.ngOnChanges(changes);
        this.initItems();
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.initItems();

        this.transitionService.onSuccess({}, () => {
            this.expandItems();
        });
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
        this.expandItems();
        this.cdr.markForCheck();
    }

    protected expandItems(): void {
        for (const item of this.items) {
            if (_get(item, 'parent')) {
                const itemsGroup: IMenuItemsGroup = item as IMenuItemsGroup;
                for (const subitem of itemsGroup.items) {
                    itemsGroup.expand = this.isActive(subitem.params?.state?.name);
                }
            }
        }
    }
}
