import {
    Component,
    OnInit,
    Inject,
    ChangeDetectionStrategy,
    Input,
} from '@angular/core';

import {
    BehaviorSubject,
} from 'rxjs';
import {TranslateService} from '@ngx-translate/core';

import {
    AbstractComponent,
    IMixedParams,
    ConfigService,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user';
import {LocalJackpotsHelper} from 'wlc-engine/modules/local-jackpots/system/helpers';

import * as Params from './jackpot-won.params';

@Component({
    selector: '[wlc-jackpot-won]',
    templateUrl: './jackpot-won.component.html',
    styleUrls: ['./styles/jackpot-won.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JackpotWonComponent extends AbstractComponent implements OnInit {

    @Input() protected inlineParams: Params.IJackpotWonCParams;

    public override $params: Params.IJackpotWonCParams;

    constructor(
        @Inject('injectParams') protected params: Params.IJackpotWonCParams,
        configService: ConfigService,
        protected translateService: TranslateService,
    ) {
        super(
            <IMixedParams<Params.IJackpotWonCParams>>{
                injectParams: params,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        const profile: BehaviorSubject<UserProfile>
            = this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$');
        this.$params.userCurrency = profile?.getValue().currency || 'EUR';
    }

    public userCurrencyFormat(currentLang: string, currency: string): string {
        return LocalJackpotsHelper.userCurrencyFormat(currentLang, currency);
    }

}
