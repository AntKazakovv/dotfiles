import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
    ViewChild,
} from '@angular/core';
import {
    SwiperConfigInterface,
    SwiperDirective,
} from 'ngx-swiper-wrapper';

import {ConfigService} from 'wlc-engine/modules/core/services';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import * as Params from './scrollbar.params';

@Component({
    selector: '[wlc-scrollbar]',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./styles/scrollbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollbarComponent extends AbstractComponent
    implements OnInit, AfterViewChecked {

    @ViewChild(SwiperDirective) directiveRef: SwiperDirective;

    @Input() protected inlineParams: Params.IScrollbarCParams;

    public swiperOptions: SwiperConfigInterface = Params.defaultSwiperOptions;

    constructor(
        protected configService: ConfigService,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService);
    }

    public ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

    public ngAfterViewChecked(): void {
        this.directiveRef.update();
    }

    public contentResizeHandler(): void {
        this.directiveRef.update();
    }
}
