import {
    Component,
    OnInit,
    Inject,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {AbstractComponent} from 'wlc-engine/modules/core';

import * as Params from './limit-value.params';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
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
        protected translate: TranslateService,
    ) {
        super({injectParams: params, defaultParams: Params.defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();

        if (this.$params.valueType === 'realityChecker') {
            const value = parseInt(this.$params.value, 10);
            if (value >= 60) {
                this.timeText = Math.floor(value / 60) + ' '
                    + this.translate.instant(Math.floor(value / 60) < 2 ? gettext('Hour') : gettext('Hours'));
                if (value % 60 !== 0) {
                    this.timeText += ' ' + value % 60 + ' ' + this.translate.instant(gettext('Minutes'));
                }
            } else {
                this.timeText = value + ' ' + this.translate.instant(gettext('Minutes'));
            }
        }
    }
}
