import {
    ChangeDetectionStrategy,
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
import * as Interfaces from './tooltip.interfaces';

@Component({
    selector: '[wlc-tooltip]',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./styles/tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Interfaces.ITooltipCParams;

    public override $class: string;
    public override $params: Interfaces.ITooltipCParams;
    public isShow: boolean;
    public iconPath: string;

    protected positionChanged: boolean = false;
    protected resized: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Interfaces.ITooltipCParams,
        protected modalService: ModalService,
        protected actionService: ActionService,
    )
    {
        super(
            <IMixedParams<Interfaces.ITooltipCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.iconPath = `/wlc/icons/${this.$params.iconName}.svg`;
    }

    @HostListener('click', ['$event']) stopPropagation(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    public openModal($event: MouseEvent): void {
        $event.stopPropagation();
        $event.preventDefault();
        this.modalService.showModal(this.$params.modal, this.$params.modalParams);
    }

    public get containerClassMod(): string {
        return this.$params.bsTooltipMod
            ? `${this.$class}__bs-tooltip--${this.$params.bsTooltipMod}`
            : '';
    }
}
