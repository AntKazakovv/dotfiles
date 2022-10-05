import {Injectable} from '@angular/core';

import {BehaviorSubject} from 'rxjs';
import {
    filter,
    map,
} from 'rxjs/operators';

import {
    IUserProfile,
    PepStatus,
    PepStatusValuableOnly,
} from 'wlc-engine/modules/core/system/interfaces/user.interface';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';
import {IPushMessageParams} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {LogService} from 'wlc-engine/modules/core';
import {NotificationEvents} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {UserService} from 'wlc-engine/modules/user';
import {phrases} from 'wlc-engine/modules/user/system/services/pep/pep.translations';

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
    public readonly statusChanges$ = new BehaviorSubject<PepStatus | null>(null);

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
                message: phrases.error.incorrectPassword.message,
            },
        ],
    ]);

    constructor(
        protected eventService: EventService,
        protected logService: LogService,
        protected userService: UserService,
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
     * Allows to set either `'true'` or `'false'` as PEP status
     *
     * @param {PepStatusValuableOnly} pep Is the user PEP or not
     * @param {string} password The current user's password
     */
    public async confirmStatus(pep: PepStatusValuableOnly, password: string): Promise<void> {
        await this.updateProfile({
            extProfile: {pep},
            currentPassword: password,
        });
    }

    /**
     * Allows to cancel PEP status.
     * That means status will be the same the `''` (empty string)
     */
    public async cancelStatus(): Promise<void> {
        await this.updateProfile({
            extProfile: {pep: ''},
        });
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

    protected listenForProfileChanges(): void {
        this.userService.userProfile$
            .pipe(
                filter((profile) => !!profile?.extProfile),
                map((profile) => profile.extProfile.pep),
            )
            .subscribe((status) => this.statusChanges$.next(status));
    }

    protected async updateProfile(updates: Partial<IUserProfile>): Promise<void> {
        const response = await this.userService.updateProfile(updates, true);

        if (response !== true) {
            this.logService.sendLog({
                code: '1.1.26',
                from: {
                    service: 'PepService',
                    method: 'updateProfile',
                },
            });

            throw new Error('Changing PEP status error');
        }
    }
}
