import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    Host,
    Optional,
} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './slider-navigation.params';

@Component({
    selector: '[wlc-slider-navigation]',
    templateUrl: './slider-navigation.component.html',
    styleUrls: ['./styles/slider-navigation.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SliderNavigationComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.ISliderNavigationCParams;
    @Input() public classNext: string;
    @Input() public classPrev: string;

    public override $params: Params.ISliderNavigationCParams;

    constructor(
        @Host()
        @Optional()
        @Inject('injectParams')
        protected injectParams: Params.ISliderNavigationCParams,
    ) {
        super(
            <IMixedParams<Params.ISliderNavigationCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
