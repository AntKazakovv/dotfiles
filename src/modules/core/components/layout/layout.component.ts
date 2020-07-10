import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, Input, OnInit} from '@angular/core';
import {StateService, TransitionService} from '@uirouter/core';
import {ILayoutComponent, ILayoutStateConfig} from 'wlc-engine/interfaces';
import {LayoutService} from 'wlc-engine/modules/core/services';

@Component({
    selector: '[wlc-layout]',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
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
        private cdr: ChangeDetectorRef,
    ) {
    }

    async ngOnInit(): Promise<void> {
        await this.setComponents(this.stateService.$current.name);
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
                }
            );
        }
        return component.injector;
    }

    private async setComponents(state: string): Promise<void> {
        this.currentConfig = await this.layoutService.getLayout(state);
        this.components = this.currentConfig.sections[this.section]?.components as ILayoutComponent[] || [];
        this.cdr.detectChanges();
    }
}
