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
    trigger,
    style,
    transition,
    animate,
} from "@angular/animations";
import {
    AbstractComponent,
    IMixedParams,
} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './tooltip.params';

@Component({
    selector: '[wlc-tooltip]',
    templateUrl: './tooltip.component.html',
    styleUrls: ['./styles/tooltip.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [
        trigger('showTooltip', [
            transition(':enter', [
                style({opacity: 0}),
                animate('0.2s', style({opacity: 1})),
            ]),
            transition(':leave', [
                animate('0.2s', style({opacity: 0})),
            ]),
        ]),
    ],
})
export class TooltipComponent extends AbstractComponent implements OnInit {
    public $class: string;
    public $params: Params.ITooltipCParams;
    public isShow: boolean;
    @Input() protected inlineParams: Params.ITooltipCParams;

    constructor(
        @Inject('injectParams') protected params: Params.ITooltipCParams,
        protected cdr: ChangeDetectorRef,
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

    @HostListener("mouseover") onMouseEnter() {
        this.showTooltip();
    }

    @HostListener("mouseleave") onMouseLeave() {
        this.hideTooltip();
    }

    public showTooltip(): void {
        this.isShow = true;
    }

    public hideTooltip(): void {
        this.isShow = false;
    }
}
