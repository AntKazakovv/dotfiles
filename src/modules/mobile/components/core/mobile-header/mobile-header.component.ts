import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {Location} from '@angular/common';
import {
    Transition,
    UIRouter,
    StateService,
} from '@uirouter/core';

import _includes from 'lodash-es/includes';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ConfigService,
    EventService,
    LayoutService,
    ModalService,
} from 'wlc-engine/modules/core';
import * as Params from './mobile-header.params';

@Component({
    selector: '[wlc-mobile-header]',
    templateUrl: './mobile-header.component.html',
    styleUrls: ['./styles/mobile-header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileHeaderComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.IMobileHeaderParams;
    public title: string = '';
    public isHidden: boolean = false;
    public actionBtn: Params.IActionButton;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IMobileHeaderParams,
        protected configService: ConfigService,
        protected router: UIRouter,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected stateService: StateService,
        protected eventService: EventService,
        protected layoutService: LayoutService,
        protected location: Location,
    ) {
        super(
            <IMixedParams<Params.IMobileHeaderParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.checkVisibility(this.router.globals.current.name);
        this.actionBtn = this.$params.actionButtonByState?.[this.router.globals.current.name];

        this.layoutService.pageTitle.subscribe((title: string) => {
            this.title = title;
            this.cdr.detectChanges();
        });

        this.eventService.subscribe({name: 'TRANSITION_SUCCESS'}, (transition: Transition): void => {
            const stateName: string = transition.targetState().name();
            this.checkVisibility(stateName);
            this.actionBtn = this.$params.actionButtonByState?.[stateName];
            this.cdr.detectChanges();
        }, this.$destroy);

        this.cdr.detectChanges();
    }

    public checkVisibility(stateName: string): void {
        if (this.$params.hideForStates) {
            this.isHidden = _includes(this.$params.hideForStates, stateName);
        }
    }

    public goBack(): void {
        this.location.back();
    }

    public onActionBtnClick(): void {
        if (this.actionBtn.openState) {
            this.stateService.go(
                this.actionBtn.openState.state,
                this.actionBtn.openState.params,
                this.actionBtn.openState.options,
            );
        } else if (this.actionBtn.showModal) {
            this.modalService.showModal(this.actionBtn.showModal);
        }
    }
}
