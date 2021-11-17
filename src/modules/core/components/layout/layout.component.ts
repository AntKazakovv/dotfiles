import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Injector,
    Input,
    OnInit,
    OnDestroy,
    ViewEncapsulation,
} from '@angular/core';
import {
    TransitionService,
    UIRouterGlobals,
} from '@uirouter/core';
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
} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
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

@Component({
    selector: '[wlc-layout]',
    templateUrl: './layout.component.html',
    styleUrls: ['./styles/layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit, OnDestroy {

    @Input() protected sectionName: string;
    @Input() protected layouts: LayoutsType;

    public components: ILayoutComponent[] = [];
    public section: ILayoutSectionConfig;
    protected allComponents$: ILayoutComponent[] = [];
    private currentConfig: ILayoutStateConfig;
    private $destroy: Subject<void> = new Subject();

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
    ) {
    }

    async ngOnInit(): Promise<void> {
        if (!this.uiRouter?.transition?.isActive()) {
            await this.setComponents(this.uiRouter.current.name, this.uiRouter.params);
        }

        this.eventService.subscribe({name: 'TRANSITION_ENTER'}, () => {
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
        this.currentConfig = await this.layoutService.getLayout(this.layouts, state, params);
        this.eventService.emit({
            name: 'SECTION_READY',
            data: {
                sectionName: this.sectionName,
            },
        });
        this.section = this.currentConfig.sections[this.sectionName];
        this.getAllComponents();
        this.setWatcher();
        this.updateComponents();
    }

    protected setWatcher(): void {
        if (GlobalHelper.hasDisplayResize(this.allComponents$)) {

            GlobalHelper.overrideDisplayResize(this.allComponents$);

            if (!this.resize$) {
                this.resize$ = fromEvent(window, 'resize').pipe(takeUntil(this.$destroy)).subscribe({
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
        const allComponents = this.section?.components as ILayoutComponent[] || [];

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
        this.allComponents$.push(...allComponents);
    }

    protected updateComponents(): void {
        if (this.components) {
            this.components.length = 0;
        }
        this.components.push(
            ...this.layoutService.filterDisplayElements(this.allComponents$),
        );
        this.cdr.markForCheck();
    }
}
