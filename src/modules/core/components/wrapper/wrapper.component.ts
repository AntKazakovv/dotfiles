import {TransitionService, UIRouterGlobals} from '@uirouter/core';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Injector,
    Input,
    OnChanges,
    OnInit,
    ViewEncapsulation,
    SimpleChanges,
} from '@angular/core';
import {
    ILayoutComponent,
    ConfigService,
    EventService,
    LayoutService,
} from 'wlc-engine/modules/core';

import _merge from 'lodash-es/merge';



export interface IWrapperCParams {
    components?: ILayoutComponent[];
    class?: string;
    wlcElement?: string;
}

@Component({
    selector: '[wlc-wrapper]',
    templateUrl: './wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class WrapperComponent extends LayoutComponent implements OnInit, OnChanges {
    @HostBinding('class') protected $hostClass: string;
    @HostBinding('attr.data-wlc-element') protected $wlcElement: string;
    @Input() protected inlineParams: IWrapperCParams;
    protected $params: IWrapperCParams;
    private initReady: boolean = false;

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
        this.initReady = true;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.initReady) {
            this.prepareParams();
            this.initComponents();
        }
    }

    protected prepareParams(): void {
        this.$params = _merge(this.inlineParams, this.params);
    }

    private async initComponents(): Promise<void> {
        this.$hostClass = this.$params?.class;
        this.$wlcElement = this.$params?.wlcElement;
        this.allComponents$.length = 0;

        for (const el of this.$params?.components) {
            this.allComponents$.push({
                ...el,
                componentClass: await this.layoutService.loadComponent(el.name),
            });
        }
        this.setWatcher();
        this.updateComponents();
    }
}
