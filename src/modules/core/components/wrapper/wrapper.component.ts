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
    Optional,
} from '@angular/core';
import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';

import _merge from 'lodash-es/merge';
import _isUndefined from 'lodash-es/isUndefined';

import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {ILayoutComponent} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {WINDOW} from 'wlc-engine/modules/app/system';


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
    /**
     * additional input for pass inlineParams from dynamic html component
     * because camelCase attributes translate to lowercase
     */
    @Input() protected inline: IWrapperCParams;
    protected $params: IWrapperCParams;
    private initReady: boolean = false;

    constructor(
        @Optional() @Inject('injectParams') protected params: IWrapperCParams,
        protected configService: ConfigService,
        layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        protected injectionService: InjectionService,
        @Inject(WINDOW) protected window: Window,
    ) {
        super(
            configService,
            layoutService,
            cdr,
            transition,
            injector,
            uiRouter,
            eventService,
            window,
        );
    }

    public async ngOnInit(): Promise<void> {
        this.prepareParams();
        await this.initComponents();
        this.initReady = true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public ngOnChanges(changes: SimpleChanges): void {
        if (this.initReady) {
            this.prepareParams();
            this.initComponents();
        }
    }

    protected prepareParams(): void {
        this.$params = _merge(this.inlineParams, this.inline, this.params);
    }

    private async initComponents(): Promise<void> {
        this.$hostClass = this.$params?.class;
        this.$wlcElement = this.$params?.wlcElement;
        this.allComponents$.length = 0;

        for (const el of this.$params?.components) {
            const configProperty = el.display?.configProperty;
            if (!_isUndefined(configProperty) &&
                !this.configService.get<unknown>(configProperty)
            ) {
                continue;
            }

            this.allComponents$.push({
                ...el,
                componentClass: await this.injectionService.loadComponent(el.name),
            });
        }
        this.setWatcher();
        this.updateComponents();
    }
}
