import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    Host,
    Optional,
} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';

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
        cdr: ChangeDetectorRef,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.ISliderNavigationCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }
}
