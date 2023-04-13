import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {SafeResourceUrl} from '@angular/platform-browser';

import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    filter,
    map,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    TUserValidationLevel,
} from 'wlc-engine/modules/core';
import {
    ShuftiProKycamlService,
} from 'wlc-engine/modules/profile/system/services/shufti-pro-kycaml/shufti-pro-kycaml.service';
import {UserInfo} from 'wlc-engine/modules/user';

import * as Params from './shufti-pro-kycaml.params';

@Component({
    selector: '[wlc-shufti-pro-kycaml]',
    templateUrl: './shufti-pro-kycaml.component.html',
    styleUrls: ['./styles/shufti-pro-kycaml.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        ShuftiProKycamlService,
    ],
})
export class ShuftiProKycamlComponent extends AbstractComponent implements OnInit {

    public url: SafeResourceUrl;
    public get ready(): boolean {
        return this._ready && !!this.validationLevel;
    };
    public validationLevel: TUserValidationLevel;
    public error: boolean = false;

    protected _ready: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IShuftiProKycamlCParams,
        protected shuftiProKycamlService: ShuftiProKycamlService,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super(
            <IMixedParams<Params.IShuftiProKycamlCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.injectParams);

        try {
            this.url = await this.shuftiProKycamlService.getIframeUlr();
        } catch (error) {
            this.error = true;
        } finally {
            this._ready = true;
            this.cdr.detectChanges();
        }

        this.configService.get<BehaviorSubject<UserInfo>>({name: '$user.userInfo$'})
            .pipe(
                filter((v) => !!v),
                map((v) => v.validationLevel),
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            )
            .subscribe((validationLevel) => {
                this.validationLevel = validationLevel;
                this.cdr.detectChanges();
            });
    }
}
