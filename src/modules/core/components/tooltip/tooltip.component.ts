import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
    HostListener,
} from '@angular/core';

import _map from 'lodash-es/map';

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
    public iconPath: string;
    public containerClass: string;

    protected positionChanged: boolean = false;
    protected resized: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITooltipCParams,
        protected modalService: ModalService,
        protected cdr: ChangeDetectorRef,
        protected actionService: ActionService,
    )
    {
        super(
            <IMixedParams<Params.ITooltipCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.iconPath = `/wlc/icons/${this.$params.iconName}.svg`;
        this.setTooltipContainerClasses();
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

    public setTooltipContainerClasses(): void {
        const classes: string[] = _map(this.modifiers, (modifier: string): string => {
            return `${this.$class}__bs-tooltip-${modifier}`;
        });
        classes.push(`${this.$class}__bs-tooltip`);
        this.containerClass = classes.join(' ');
        this.cdr.markForCheck();
    }
}
