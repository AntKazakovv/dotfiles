import {TransitionService, UIRouterGlobals} from '@uirouter/core';
import {ILayoutComponent} from 'wlc-engine/interfaces';
import {LayoutComponent} from 'wlc-engine/modules/core/components/layout/layout.component';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    HostBinding,
    Inject,
    Injector,
    OnInit,
} from '@angular/core';
import {
    ConfigService,
    EventService,
    LayoutService,
} from 'wlc-engine/modules/core/services';

export interface IWrapperCParams {
    components: ILayoutComponent[];
    class?: string;
}

@Component({
    selector: '[wlc-wrapper]',
    templateUrl: './wrapper.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapperComponent extends LayoutComponent implements OnInit {
    @HostBinding('class') protected $hostClass: string;

    constructor(
        ConfigService: ConfigService,
        layoutService: LayoutService,
        cdr: ChangeDetectorRef,
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
        await this.initComponents();
    }

    private async initComponents(): Promise<void> {
        this.$hostClass = this.params?.class;

        for (const el of this.params?.components) {
            this.allComponents$.push({
                ...el,
                componentClass: await this.layoutService.loadComponent(el.name),
            });
        }
        this.setWatcher();
        this.components = this.filterComponents();
        this.cdr.markForCheck();
    }
}
