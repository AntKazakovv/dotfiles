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
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {WINDOW} from 'wlc-engine/modules/app/system';
import * as Interfaces from './wrapper.interfaces';

@Component({
    selector: '[wlc-wrapper]',
    templateUrl: './wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class WrapperComponent extends LayoutComponent implements OnInit, OnChanges {
    @HostBinding('class') protected override $hostClass: string;
    @HostBinding('attr.data-wlc-element') protected $wlcElement: string;
    @Input() protected inlineParams: Interfaces.IWrapperCParams;
    /**
     * additional input for pass inlineParams from dynamic html component
     * because camelCase attributes translate to lowercase
     */
    @Input() protected inline: Interfaces.IWrapperCParams;
    protected $params: Interfaces.IWrapperCParams;
    private initReady: boolean = false;

    constructor(
        @Optional() @Inject('injectParams') protected params: Interfaces.IWrapperCParams,
        configService: ConfigService,
        layoutService: LayoutService,
        cdr: ChangeDetectorRef,
        transition: TransitionService,
        injector: Injector,
        uiRouter: UIRouterGlobals,
        eventService: EventService,
        protected injectionService: InjectionService,
        @Inject(WINDOW) window: Window,
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

    public override async ngOnInit(): Promise<void> {
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

        if (this.$params.smartSection) {
            this.initSmartSection();
        }

        this.setHostClass();
    }

    protected setHostClass(): void {
        let hostClass = this.$params.class || '';

        if (this.smartSectionConfig?.hostClasses) {
            hostClass += ` ${this.smartSectionConfig.hostClasses}`;
        }

        this.$hostClass = hostClass;
    }

    protected override initSmartSection(): void {
        this.useColumnsLayout = this.$params.components?.length > 1;
        this.smartSectionConfig = this.$params.smartSection;
    }

    private async initComponents(): Promise<void> {
        this.$wlcElement = this.$params.wlcElement;
        this.allComponents$.length = 0;

        this.$params.components = this.changeConfigStandaloneComponents(this.$params.components);

        for (const component of this.$params.components) {
            const configProperty = component && component.display?.configProperty;
            if (!_isUndefined(configProperty) &&
                !this.configService.get<unknown>(configProperty)
            ) {
                continue;
            }

            this.allComponents$.push({
                ...component,
                componentClass: await this.injectionService.loadComponent(component.name),
            });
        }
        this.setWatcher();
        this.updateComponents();
    }
}
