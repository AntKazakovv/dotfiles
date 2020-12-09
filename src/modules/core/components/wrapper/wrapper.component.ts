import {TransitionService, UIRouterGlobals} from '@uirouter/core';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Injector,
    Input,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    ConfigService,
    EventService,
    LayoutService,
} from 'wlc-engine/modules/core/system/services';

import {
    merge as _merge,
} from 'lodash';

export interface IWrapperCParams {
    components?: ILayoutComponent[];
    class?: string;
}

@Component({
    selector: '[wlc-wrapper]',
    templateUrl: './wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class WrapperComponent extends LayoutComponent implements OnInit {
    @HostBinding('class') protected $hostClass: string;
    @Input() protected inlineParams: IWrapperCParams;
    protected $params: IWrapperCParams;

    constructor(
        ConfigService: ConfigService,
        layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        @Inject('injectParams') protected params: IWrapperCParams,
    ) {
        super(
            ConfigService,
            layoutService,
            cdr,
            transition,
            injector,
            uiRouter,
            eventService,
        );
    }

    public async ngOnInit(): Promise<void> {
        this.prepareParams();
        await this.initComponents();
    }

    protected prepareParams(): void {
        this.$params = _merge(this.inlineParams, this.params);
    }

    private async initComponents(): Promise<void> {
        this.$hostClass = this.$params?.class;

        for (const el of this.$params?.components) {
            this.allComponents$.push({
                ...el,
                componentClass: await this.layoutService.loadComponent(el.name),
            });
        }
        this.setWatcher();
        this.components = this.filterComponents();
        this.cdr.markForCheck();
    }
}
