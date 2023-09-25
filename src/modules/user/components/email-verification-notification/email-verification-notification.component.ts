import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    OnDestroy,
} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    tap,
    takeUntil,
} from 'rxjs/operators';

import {
    Transition,
    UIRouter,
} from '@uirouter/core';

import _includes from 'lodash-es/includes';

import {
    AbstractComponent,
    ConfigService,
    BodyClassService,
    EventService,
    IPushMessageParams,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {WINDOW} from 'wlc-engine/modules/app/system';
import {UserService} from 'wlc-engine/modules/user/system/services/user/user.service';
import {UserProfile} from 'wlc-engine/modules/user/system/models/profile.model';

import * as Params from './email-verification-notification.params';

@Component({
    selector: '[wlc-email-verification-notification]',
    templateUrl: './email-verification-notification.component.html',
    styleUrls: ['./styles/email-verification-notification.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class EmailVerificationNotificationComponent extends AbstractComponent implements OnInit, OnDestroy {
    @Input() protected inlineParams: Params.IEmailVerificationNotificationCParams;

    public override $params: Params.IEmailVerificationNotificationCParams;
    public show$: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(
        @Inject('injectParams') protected injectParams: Params.IEmailVerificationNotificationCParams,
        configService: ConfigService,
        protected userService: UserService,
        protected bodyClassService: BodyClassService,
        protected eventService: EventService,
        protected router: UIRouter,
        @Inject(WINDOW) protected window: Window,
    ) {
        super({injectParams, defaultParams: Params.defaultParams}, configService);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        if (!this.$params.useButtonGoToMail) {
            this.addModifiers('without-btn');
        }

        this.configService.get<BehaviorSubject<UserProfile>>({name: '$user.userProfile$'})
            .pipe(
                filter(v => !!v?.idUser),
                tap((profile: UserProfile) => this.setVerificationState(profile)),
                takeUntil(this.$destroy),
            )
            .subscribe();

        this.checkExcludeStates();
        this.eventService.subscribe({
            name: 'EMAIL_VERIFY',
        }, () => {
            this.userService.fetchUserProfile();
        }, this.$destroy);
    }

    public override ngOnDestroy(): void {
        this.logoutHandler();
    }

    protected close(): void {
        this.configService.set({
            name: 'verified',
            value: true,
            storageType: 'localStorage',
        });
        this.changeVisibility(this.getState());
    }

    protected goToMail(): void {
        const mail: string = this.userService.userProfile.email?.substring(
            this.userService.userProfile.email?.indexOf('@') + 1);
        this.window.open('https://' + mail);
    }

    protected async sendVerificationLink(): Promise<void> {
        try {
            await this.userService.emailVerification();

            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'success',
                    title: gettext('Email verification link sending'),
                    message: gettext(
                        'A mail with a verification link has been sent to your email address. '
                        + 'If you have not received an email, please check your spam folder.'),
                    wlcElement: 'notification_email-verification-link-sending-success',
                },
            });
        } catch (error) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: <IPushMessageParams>{
                    type: 'error',
                    title: gettext('Email verification link sending'),
                    message: error.errors,
                    wlcElement: 'notification_email-verification-link-sending-error',
                },
            });
        }
    }

    protected logoutHandler(): void {
        this.configService.set({
            name: 'verified',
            value: null,
            storageType: 'localStorage',
        });

        this.show$.next(false);
        this.removeModifiers('show');
        this.bodyClassService.removeClassByPrefix('wlc-body--notify');
    }

    protected setVerificationState(profile: UserProfile): void {
        const state: boolean = this.configService.get({
            name: 'verified',
            storageType: 'localStorage',
        });

        if (!state) {
            this.configService.set({
                name: 'verified',
                value: profile.emailVerified,
                storageType: 'localStorage',
            });
        }

        this.changeVisibility(this.getState());
    }

    protected getState(): boolean {
        return this.configService.get({
            name: 'verified',
            storageType: 'localStorage',
        });
    }

    protected changeVisibility(hidden: boolean): void {
        if (this.isExcludeStates() || hidden) {
            this.show$.next(false);
            this.removeModifiers('show');
            this.bodyClassService.removeClassByPrefix('wlc-body--notify');
        } else {
            this.show$.next(true);
            this.bodyClassService.addModifier('wlc-body--notify');
            this.addModifiers('show');
        }
    }

    //excludes states functionality

    protected isExcludeStates(): boolean {
        return _includes(this.$params?.excludeStates, this.router.globals.current.name);
    }

    protected checkExcludeStates(): void {
        this.router.transitionService.onSuccess({}, (transition: Transition) => {
            const stateName: string = transition.targetState().name();

            if (!this.getState()) {
                this.changeVisibility(_includes(this.$params?.excludeStates, stateName));
            }
        });
    }
}
