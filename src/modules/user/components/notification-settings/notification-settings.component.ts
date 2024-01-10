import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ChangeDetectorRef,
    Injector,
    inject,
    DestroyRef,
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

import {Subject} from 'rxjs';

import {
    AbstractComponent,
    ConfigService,
    ModalService,
    LogService,
} from 'wlc-engine/modules/core';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {SubscriptionsType} from 'wlc-engine/modules/user/components/subscriptions-modal/subscriptions-modal.params';

import * as Params from './notification-settings.params';

@Component({
    selector: '[wlc-notification-settings]',
    templateUrl: './notification-settings.component.html',
    styleUrls: ['./styles/notification-settings.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NotificationSettingsComponent extends AbstractComponent implements OnInit {
    @Input() protected inlineParams: Params.INotificationSettingsCParams;

    public override $params: Params.INotificationSettingsCParams;
    public lockButton: boolean = false;
    protected agreeSubscriptions$: Subject<SubscriptionsType> = new Subject<SubscriptionsType>();
    protected _agreeSubscriptionsInjector: Injector;

    protected readonly userService = inject(UserService);
    protected readonly modalService = inject(ModalService);
    protected readonly logService = inject(LogService);
    protected readonly destroy = inject(DestroyRef);

    constructor(
        @Inject('injectParams') protected injectParams: Params.INotificationSettingsCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService, cdr);
    }

    public get agreeSubscriptionsInjector(): Injector {
        return this._agreeSubscriptionsInjector ??= Injector.create({
            providers: [
                {
                    provide: 'injectParams',
                    useValue: {},
                },
                {
                    provide: 'agreeSubscriptions',
                    useValue: this.agreeSubscriptions$,
                },
            ],
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.setSubscriptions();
    }

    public showModalSubscription(): void {
        this.modalService.showModal({
            id: 'subscriptions-modal',
            modifier: 'confirmation',
            componentName: 'user.wlc-subscriptions-modal',
            rejectBtnVisibility: false,
            showFooter: false,
            dismissAll: true,
            injector: this.agreeSubscriptionsInjector,
        });
    }

    protected setSubscriptions(): void {
        this.agreeSubscriptions$
            .pipe(takeUntilDestroyed(this.destroy))
            .subscribe(({emailAgree, smsAgree}: SubscriptionsType) => {
                this.subscriptionUpdate({emailAgree, smsAgree});
            });
    }

    protected async subscriptionUpdate({emailAgree, smsAgree}: SubscriptionsType): Promise<void> {
        try {
            this.setLockButton(true);

            await this.userService.updateProfile({
                emailAgree,
                smsAgree,
            }, {updatePartial: true});

            this.setLockButton(false);
        } catch (error) {
            this.logService.sendLog({code: '24.0.0', data: error});
        }
    }

    protected setLockButton(value: boolean): void {
        this.lockButton = value;
        this.cdr.markForCheck();
    }
}
