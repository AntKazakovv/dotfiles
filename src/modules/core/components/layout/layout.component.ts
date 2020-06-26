import {Component, OnInit, Input, Injector} from '@angular/core';
import {StateService} from '@uirouter/core';
import {LayoutService} from 'wlc-engine/modules/core/services';
import {ILayoutStateConfig, ILayoutComponent} from 'wlc-engine/interfaces';
import {TransitionService} from '@uirouter/core';

@Component({
    selector: 'wlc-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    @Input() section: string;

    public components: ILayoutComponent[] = [];
    private currentConfig: ILayoutStateConfig;

    constructor(
        private layoutService: LayoutService,
        private stateService: StateService,
        private transition: TransitionService,
        private injector: Injector,
    ) {}

    async ngOnInit(): Promise<void> {
        this.setComponents(this.stateService.$current.name);
        this.transition.onEnter({}, (transition) => {
            this.setComponents(transition.to().name);
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
            }
            );
        }
        return component.injector;
    }

    private async setComponents(state: string): Promise<void> {
        this.currentConfig = await this.layoutService.getLayout(state);
        this.components = this.currentConfig.sections[this.section]?.components as ILayoutComponent[] || [];
    }
}
