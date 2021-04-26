import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    HostListener,
} from '@angular/core';

import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {
    ModalService,
    ActionService,
} from 'wlc-engine/modules/core';

import * as Params from './tooltip.params';

@Component({
    selector: '[wlc-tooltip]',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./styles/tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ITooltipCParams;

    public $class: string;
    public $params: Params.ITooltipCParams;
    public isShow: boolean;

    protected positionChanged: boolean = false;
    protected resized: boolean = false;

    constructor(
        @Inject('injectParams') protected params: Params.ITooltipCParams,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
    )
    {
        super(
            <IMixedParams<Params.ITooltipCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    @HostListener('click', ['$event']) stopPropagation(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    public openModal($event: MouseEvent): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.modalService.showModal(this.$params.modal, this.$params.modalParams);
    }
}
