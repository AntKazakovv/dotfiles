import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Input,
    OnInit,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    distinctUntilChanged,
    map,
    takeUntil,
} from 'rxjs/operators';

import {
    AbstractComponent,
    ConfigService,
    IInputCParams,
} from 'wlc-engine/modules/core';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import * as Params from './fundist-user-id.params';

@Component({
    selector: '[wlc-fundist-user-id]',
    templateUrl: './fundist-user-id.component.html',
    styleUrls: ['./styles/fundist-user-id.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundistUserIdComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.IFundistUserIdCParams;

    public $params: Params.IFundistUserIdCParams;
    public inputParams: IInputCParams = Params.inputParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IFundistUserIdCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);

        this.prepareInput();
        this.listenForUserId();
    }

    protected prepareInput(): void {
        this.inputParams.control.setValue(this.$params.label);
        this.inputParams.control.disable();
    }

    protected listenForUserId(): void {
        this.configService.get<BehaviorSubject<UserProfile>>('$user.userProfile$')
            .pipe(
                map((profile: UserProfile): string => profile?.idUser),
                distinctUntilChanged(),
                takeUntil(this.$destroy),
            ).subscribe((userId: string): void => {
                this.inputParams.control.setValue(this.createControlValue(userId));
                this.cdr.markForCheck();
            });
    }

    private createControlValue(id: string): string {
        return `${this.$params.label} ${id}`;
    }
}
