import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {TransitionService, UIRouterGlobals} from '@uirouter/core';
import {ILayoutComponent, ILayoutStateConfig, ILayoutSectionConfig} from 'wlc-engine/interfaces/layouts.interface';
import {LayoutService} from 'wlc-engine/modules/core/services';


@Component({
    selector: '[wlc-layout]',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutComponent implements OnInit {

    @Input() protected sectionName: string;

    public components: ILayoutComponent[] = [];
    public section: ILayoutSectionConfig;

    private currentConfig: ILayoutStateConfig;

    constructor(
        private layoutService: LayoutService,
        private transition: TransitionService,
        private injector: Injector,
        private cdr: ChangeDetectorRef,
        private uiRouter: UIRouterGlobals
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
                        provide: 'params',
                        useValue: component.params || {}
                    }
                ],
                parent: this.injector
            });
        }
        return component.injector;
    }

    private async setComponents(state: string): Promise<void> {
        this.currentConfig = await this.layoutService.getLayout(state);
        this.section = this.currentConfig.sections[this.sectionName];
        this.components = this.section?.components as ILayoutComponent[] || [];
        this.cdr.detectChanges();
    }
}
