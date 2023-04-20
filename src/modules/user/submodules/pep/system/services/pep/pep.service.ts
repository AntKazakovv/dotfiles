import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {
    IUserProfile,
    PepStatus,
    EventService,
    IPushMessageParams,
    LogService,
    NotificationEvents,
    InjectionService,
} from 'wlc-engine/modules/core';
import {IMessageData} from 'wlc-engine/modules/core/components/message/message.interface';
import {UserService} from 'wlc-engine/modules/user';
import {phrases} from 'wlc-engine/modules/user/submodules/pep/system/services/pep/pep.translations';

type PepPrefixed<S extends string> = `PEP_${S}`;

type PepStatusEventKind = PepPrefixed<'STATUS_CANCEL'>;

type PepErrorEventKind = PepPrefixed<`ERROR_${'INCORRECT_PASSWORD' | 'CHANGE_STATUS'}`>

export type PepEventKind = PepStatusEventKind | PepErrorEventKind;

export type PepModalId = 'pepInfo' | 'pepConfirmation' | 'pepSaved';

@Injectable({providedIn: 'root'})
export class PepService {
    /**
     * Observable provides actual PEP status
     */
    public readonly statusChanges$ = new BehaviorSubject<boolean | null>(null);

    protected readonly notificationParams = new Map<PepEventKind, IPushMessageParams>([
        [
            'PEP_STATUS_CANCEL',
            {
                type: 'warning',
                title: phrases.status.cancel.title,
                message: phrases.status.cancel.message,
            },
        ],
        [
            'PEP_ERROR_INCORRECT_PASSWORD',
            {
                type: 'error',
                title: phrases.error.incorrectPassword.title,
                message: phrases.error.incorrectPassword.message,
            },
        ],
        [
            'PEP_ERROR_CHANGE_STATUS',
            {
                type: 'error',
                title: phrases.error.changeStatus.title,
                message: phrases.error.changeStatus.message,
            },
        ],
    ]);

    protected userService: UserService;

    constructor(
        protected eventService: EventService,
        protected logService: LogService,
        protected injectionService: InjectionService,
    ) {
        this.listenForPepEvents();
        this.listenForProfileChanges();
    }

    /**
     * Shortcut for `PepService.statusChanges$.value`
     *
     * @return {PepStatus | null} Actual PEP status
     */
    public get status(): PepStatus | null {
        return this.statusChanges$.value;
    }

    /**
     * Allows to set either `true` or `false` as PEP status
     *
     * @param {boolean} pep Is the user PEP or not
     * @param {string} password The current user's password
     */
    public async confirmStatus(pep: boolean, password: string): Promise<void> {
        await this.updateProfile({
            extProfile: {pep},
            currentPassword: password,
        });
    }

    /**
     * Allows to set either `true` or `false` as PEP status via Metamask
     */
    public async confirmStatusWithMetamask(pep: boolean): Promise<void> {
        await this.updateProfile({
            extProfile: {pep},
        }, true);
    }

    /**
     * Allows to cancel PEP status.
     * That means status will be the same the `''` (empty string)
     */
    public async cancelStatus(): Promise<void> {
        this.eventService.emit({name: 'PEP_CANCEL'});
    }

    /**
     * Just emits an event with `EventService` instance
     *
     * @param {PepEventKind} kind Event name
     */
    public fireEvent(kind: PepEventKind): void {
        this.eventService.emit({name: kind});
    }

    protected notify(about: PepEventKind): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: this.notificationParams.get(about),
        });
    }

    protected listenForPepEvents(): void {
        this.eventService.subscribe({name: 'PEP_STATUS_CANCEL'}, () => {
            this.cancelStatus()
                .then(() => this.notify('PEP_STATUS_CANCEL'))
                .catch(() => this.notify('PEP_ERROR_CHANGE_STATUS'));
        });

        this.eventService.subscribe({name: 'PEP_ERROR_INCORRECT_PASSWORD'}, () => {
            this.notify('PEP_ERROR_INCORRECT_PASSWORD');
        });
    }

    protected async listenForProfileChanges(): Promise<void> {
        this.userService = await this.injectionService.getService<UserService>('user.user-service');

        this.userService.userProfile$
            .pipe(filter(Boolean))
            .subscribe((profile) => this.statusChanges$.next(profile.pep));
    }

    protected async updateProfile(updates: Partial<IUserProfile>, requestConfirmation = false): Promise<void> {
        if (!this.userService) {
            this.userService = await this.injectionService.getService<UserService>('user.user-service');
        }

        const response = await this.userService.updateProfile(updates, {
            requestConfirmation,
            updatePartial: true,
            isAfterDepositWithdraw: false,
        });

        if (response.code !== 200) {
            this.logService.sendLog({
                code: '1.1.26',
                from: {
                    service: 'PepService',
                    method: 'updateProfile',
                },
            });

            if (requestConfirmation && Array.isArray(response.errors)) {
                this.showErrorNotification(response.errors);
            }

            throw new Error('Changing PEP status error');
        }
    }

    private async showErrorNotification(message: IMessageData['message']): Promise<void> {
        const data: IPushMessageParams = {
            message,
            type: 'error',
            title: gettext('Profile update failed'),
            wlcElement: 'notification_profile-update-error',
        };

        this.eventService.emit({data, name: NotificationEvents.PushMessage});
    }
}
