import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    OnInit,
} from '@angular/core';

import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';

import * as Params from './scrollbar.params';

@Component({
    selector: '[wlc-scrollbar]',
    templateUrl: './scrollbar.component.html',
    styleUrls: ['./styles/scrollbar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollbarComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IScrollbarCParams;

    public override $params: Params.IScrollbarCParams;

    constructor(
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        public host: ElementRef,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
    }

}
