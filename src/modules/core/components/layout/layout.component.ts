import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Injector,
    Input,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
    Inject,
} from '@angular/core';

import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
import {
    fromEvent,
    Subject,
    Subscription,
} from 'rxjs';
import {
    takeUntil,
} from 'rxjs/operators';
import _each from 'lodash-es/each';
import _isEqual from 'lodash-es/isEqual';
import _findIndex from 'lodash-es/findIndex';

import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LayoutService} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {LayoutsType} from 'wlc-engine/modules/core/system/services/layout/layout.service';
import {
    ILayoutComponent,
    ILayoutStateConfig,
    ILayoutSectionConfig,
    ISmartSectionConfig,
} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {standaloneComponents} from 'wlc-engine/modules/core/system/constants/modules.constants';
import {ISaCParams} from 'wlc-engine/modules/core/components/sa/sa.component';

@Component({
    selector: '[wlc-layout]',
    templateUrl: './layout.component.html',
    styleUrls: ['./styles/layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, OnDestroy {
    @HostBinding('class') protected $hostClass: string;
    @Input() protected sectionName: string;
    @Input() protected layouts: LayoutsType;

    public components: ILayoutComponent[] = [];
    public section: ILayoutSectionConfig;
    public ready: boolean = true;
    protected allComponents$: ILayoutComponent[] = [];
    protected $destroy: Subject<void> = new Subject();
    protected useColumnsLayout: boolean = false;
    protected smartSectionConfig: ISmartSectionConfig;
    protected columnList: string[];
    private currentConfig: ILayoutStateConfig;

    private resize$: Subscription;
    private auth$: Subscription;

    constructor(
        protected ConfigService: ConfigService,
        protected layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        private transition: TransitionService,
        protected injector: Injector,
        private uiRouter: UIRouterGlobals,
        protected eventService: EventService,
        @Inject(WINDOW) protected window: Window,
    ) {
    }

    async ngOnInit(): Promise<void> {
        if (!this.uiRouter?.transition?.isActive()) {
            await this.setComponents(this.uiRouter.current.name, this.uiRouter.params);
        }

        this.eventService.subscribe({name: 'TRANSITION_FINISH'}, () => {
            this.setComponents(
                this.uiRouter.transition?.targetState().name(),
                this.uiRouter.transition?.targetState().params(),
            );
        }, this.$destroy);
    }

    public getInjector(component: ILayoutComponent): Injector {
        if (!component.injector) {
            component.injector = Injector.create({
                providers: [
                    {
                        provide: 'injectParams',
                        useValue: component.params || {},
                    },
                ],
                parent: this.injector,
            });
        }
        return component.injector;
    }

    public ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected async setComponents(state: string, params?: IIndexing<any>): Promise<void> {
        this.currentConfig = this.layoutService.getLayoutConfig(this.layouts, state, params);
        if (this.currentConfig.sections[this.sectionName]?.usePreloader) {
            this.ready = false;
        };

        this.currentConfig = await this.layoutService.getLayout(this.layouts, state, params);
        this.eventService.emit({
            name: 'SECTION_READY',
            data: {
                sectionName: this.sectionName,
            },
        });
        this.section = this.currentConfig.sections[this.sectionName];

        if (this.section?.smartSection) {
            this.initSmartSection();
        }

        this.getAllComponents();
        this.setWatcher();
        this.updateComponents();
    }

    protected initSmartSection(): void {
        this.useColumnsLayout = this.section.components?.length > 1;
        this.smartSectionConfig = this.section.smartSection;

        if (this.smartSectionConfig.hostClasses) {
            this.$hostClass = this.smartSectionConfig.hostClasses;
        }
    }

    protected getColumnClasses(index: number): string {
        return this.smartSectionConfig.columns ? this.smartSectionConfig.columns[index] : 'wlc-c-12';
    }

    protected setWatcher(): void {
        if (GlobalHelper.hasDisplayResize(this.allComponents$)) {

            GlobalHelper.overrideDisplayResize(this.allComponents$);

            if (!this.resize$) {
                this.resize$ = fromEvent(this.window, 'resize').pipe(takeUntil(this.$destroy)).subscribe({
                    next: () => {
                        this.updateComponents();
                    },
                });
            }
        }

        const auth = GlobalHelper.hasDisplayAuth(this.allComponents$);

        if (auth && !this.auth$) {
            this.auth$ = this.eventService.filter(
                [{name: 'LOGIN'}, {name: 'LOGOUT'}],
                this.$destroy)
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.updateComponents();
                        }, 0);
                    },
                });
        }
    }

    protected getAllComponents(): void {
        let allComponents = this.section?.components as ILayoutComponent[] || [];

        if (this.allComponents$.length) {
            const oldList = this.allComponents$.slice();

            _each(allComponents, (component, key) => {
                const index = _findIndex(oldList, (item: ILayoutComponent) => {
                    return component.name === item.name
                        && !component.reloadOnStateChange
                        && _isEqual(component.params, item.params);
                });
                if (index !== -1) {
                    allComponents[key] = oldList[index];
                    oldList.splice(index, 1);
                }
            });
        }

        if (this.allComponents$.length) {
            this.allComponents$.length = 0;
        }

        allComponents = this.changeConfigStandaloneComponents(allComponents);

        this.allComponents$.push(...allComponents);
    }

    protected updateComponents(): void {
        if (this.components) {
            this.components.length = 0;
        }
        this.components.push(
            ...this.layoutService.filterDisplayElements(this.allComponents$),
        );
        this.ready = true;
        this.cdr.markForCheck();
    }

    protected changeConfigStandaloneComponents(components: ILayoutComponent[]): ILayoutComponent[] {
        return components.map((component) => {
            const name: string = component.name.split('.')[1];

            if (standaloneComponents[name]) {
                const saConfig: ILayoutComponent = {
                    name: 'core.wlc-sa',
                    params: <ISaCParams<unknown>>{
                        saName: name,
                        saParams: component.params,
                    },
                };

                if (component.componentClass) {
                    saConfig.componentClass = component.componentClass;
                }

                return saConfig;
            }

            return component;
        });
    }
}
