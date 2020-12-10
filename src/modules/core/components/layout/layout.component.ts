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
import {
    ILayoutComponent,
    ILayoutStateConfig,
    ILayoutSectionConfig,
} from 'wlc-engine/modules/core/system/interfaces/layouts.interface';
import {
    ConfigService,
    EventService,
    LayoutService,
} from 'wlc-engine/modules/core/system/services';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';
import {
    fromEvent,
    Subject,
} from 'rxjs';
import {
    takeUntil,
} from 'rxjs/operators';
import {LayoutsType} from 'wlc-engine/modules/core/system/services/layout/layout.service';


import {
    each as _each,
    reduce as _reduce,
    filter as _filter,
    isObject as _isObject,
    isUndefined as _isUndefined,
    assign as _assign,
} from 'lodash';

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

    constructor(
        protected ConfigService: ConfigService,
        protected layoutService: LayoutService,
        protected cdr: ChangeDetectorRef,
        private transition: TransitionService,
        protected injector: Injector,
        private uiRouter: UIRouterGlobals,
        private eventService: EventService,
    ) {
    }

    async ngOnInit(): Promise<void> {
        if (!this.uiRouter?.transition?.isActive()) {
            await this.setComponents(this.uiRouter.current.name, this.uiRouter.params);
        }
        this.transition.onEnter({}, async (transition) => {
            await this.setComponents(this.uiRouter.transition?.targetState().name(), this.uiRouter.transition?.targetState().params());
        });
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

    public ngOnDestroy() {
        this.$destroy.next();
        this.$destroy.complete();
    }

    protected async setComponents(state: string, params?: IIndexing<any>): Promise<void> {
        this.currentConfig = await this.layoutService.getLayout(this.layouts, state, params);
        this.section = this.currentConfig.sections[this.sectionName];
        this.allComponents$ = this.section?.components as ILayoutComponent[] || [];
        this.setWatcher();
        this.components = this.filterComponents();
        this.cdr.markForCheck();
    }

    protected filterComponents(): ILayoutComponent[] {
        return _filter(this.allComponents$, (component) => {

            let result = true;
            if (_isObject(component)) {
                if (!_isUndefined(component.display?.mobile)
                    && component.display?.mobile !== this.ConfigService.get<boolean>('appConfig.mobile')
                ) {
                    result = false;
                }

                if (result && (component.display?.after || component.display?.before)) {
                    if (component.display.after > component.display.before) {
                        result = result && (window.innerWidth >= component.display.after || window.innerWidth <= component.display.before);
                    } else {
                        result = result && (window.innerWidth >= component.display.after && window.innerWidth <= component.display.before);
                    }
                }

                if (result && !_isUndefined(component.display?.auth)) {
                    result = result &&
                        component.display.auth === this.ConfigService.get<boolean>('$user.isAuthenticated');
                }
            }
            return result;
        });
    }

    protected setWatcher(): void {
        const resize = _reduce(this.allComponents$, (res, component): boolean => {
            return res || (!!component.display?.after || !!component.display?.before);
        }, false);

        if (resize) {
            _each(this.allComponents$, (component, key) => {
                if (_isUndefined(component.display?.before)) {
                    _assign(this.allComponents$[key].display, {before: Number.MAX_SAFE_INTEGER});
                }

                if (_isUndefined(component.display?.after)) {
                    _assign(this.allComponents$[key].display, {after: 0});
                }
            });

            fromEvent(window, 'resize').pipe(takeUntil(this.$destroy)).subscribe({
                next: () => {
                    this.components = this.filterComponents();
                    this.cdr.markForCheck();
                },
            });
        }

        const auth = _reduce(this.allComponents$, (res, component): boolean => {
            return res || !_isUndefined(component.display?.auth);
        }, false);

        if (auth) {
            this.eventService.filter(
                [{name: 'LOGIN'}, {name: 'LOGOUT'}],
                this.$destroy)
                .subscribe({
                    next: () => {
                        setTimeout(() => {
                            this.components = this.filterComponents();
                            this.cdr.markForCheck();
                        }, 0);
                    },
                });
        }
    }
}
