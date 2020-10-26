import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {TransitionService, UIRouterGlobals} from '@uirouter/core';
import {ILayoutComponent, ILayoutStateConfig, ILayoutSectionConfig} from 'wlc-engine/interfaces/layouts.interface';
import {LayoutService} from 'wlc-engine/modules/core/services';

@Component({
    selector: '[wlc-layout]',
    templateUrl: './layout.component.html',
    styleUrls: ['./styles/layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent implements OnInit {

    @Input() protected sectionName: string;

    public components: ILayoutComponent[] = [];
    public section: ILayoutSectionConfig;

    private currentConfig: ILayoutStateConfig;

    constructor(
        protected layoutService: LayoutService,
        protected transition: TransitionService,
        protected injector: Injector,
        protected cdr: ChangeDetectorRef,
        protected uiRouter: UIRouterGlobals,
    ) {
    }

    async ngOnInit(): Promise<void> {
        await this.setComponents(this.uiRouter.current.name);
        this.transition.onEnter({}, async (transition) => {
            await this.setComponents(transition.to().name);
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

    private async setComponents(state: string): Promise<void> {
        this.currentConfig = await this.layoutService.getLayout(state);
        this.section = this.currentConfig.sections[this.sectionName];
        this.components = this.section?.components as ILayoutComponent[] || [];
        this.cdr.markForCheck();
    }
}
