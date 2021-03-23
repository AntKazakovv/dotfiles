import {
    Component,
    OnInit,
    Inject,
    ChangeDetectorRef,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
    AbstractComponent,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    LimitationService,
} from 'wlc-engine/modules/user/system/services';

import * as Params from './limit-value.params';

@Component({
    selector: '[wlc-limit-value]',
    templateUrl: './limit-value.component.html',
    styleUrls: ['./styles/limit-value.component.scss'],
})
export class LimitValueComponent extends AbstractComponent implements OnInit {
    public $params: Params.ILimitValueCParams;

    public timeText: string;

    constructor(
        @Inject('injectParams') protected params: Params.ILimitValueCParams,
        protected limitationService: LimitationService,
        protected cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        protected translate: TranslateService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.valueType === 'realityChecker') {
            const value = parseInt(this.$params.value, 10);
            if (value >= 60) {
                this.timeText = Math.floor(value / 60) + ' ' + this.translate.instant(gettext('Hours'));
                if (value % 60 !== 0) {
                    this.timeText += ' ' + value % 60 + ' ' + this.translate.instant(gettext('Minutes'));
                }
            } else {
                this.timeText = value + ' ' + this.translate.instant(gettext('Minutes'));
            }
        }
    }
}
