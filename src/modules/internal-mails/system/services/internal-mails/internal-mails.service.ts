import {Injectable} from '@angular/core';
import {StateService} from '@uirouter/core';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';

import {
    BehaviorSubject,
    distinctUntilChanged,
    Observable,
    Subject,
    Subscription,
} from 'rxjs';
import {DateTime} from 'luxon';
import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';
import _isEqual from 'lodash-es/isEqual';
import _mergeWith from 'lodash-es/mergeWith';

import {
    ConfigService,
    DataService,
    Deferred,
    EventService,
    GlobalHelper,
    IData,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core';
import {
    NotificationEvents,
    IPushMessageParams,
} from 'wlc-engine/modules/core/system/services/notification';
import {IInternalMail} from 'wlc-engine/modules/internal-mails/system/interfaces';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models';

export interface IMailNotificationsParams {
    excludedStatesForNotifications: string[];
    numberOfNotifications: number,
}

@Injectable({
    providedIn: 'root',
})
export class InternalMailsService {
    public mailsReady: Deferred<void> = new Deferred();
    public unreadMailsCount$: BehaviorSubject<number> = new BehaviorSubject(0);
    public readedMailID$: Subject<string> = new Subject();
    public currentLang: string;
    private _mails$: BehaviorSubject<InternalMailModel[]> = new BehaviorSubject([]);
    private mailsFetchHandler: Subscription;
    private newMails: InternalMailModel[];
    private notificationsParams: IMailNotificationsParams = {
        excludedStatesForNotifications: [
            'app.profile.cash.deposit',
            'app.gameplay',
        ],
        numberOfNotifications: 3,
    };

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
        private configService: ConfigService,
        private translateService: TranslateService,
        private modalService: ModalService,
        private stateService: StateService,
    ) {
        this.init();
    }

    /**
     * Get mails array Observable
     *
     * @returns {Observable<InternalMailModel[]>}
     */
    public get mails$(): Observable<InternalMailModel[]> {
        return this._mails$.pipe(distinctUntilChanged( _isEqual));
    }

    /**
     * Mark an mail as read in the database and update mails$ & unreadMailsCount$
     *
     * @param {InternalMailModel} internalMail mail to mark as read
     * @returns {Promise<void>}
     */
    public async markAsRead(internalMail: InternalMailModel): Promise<void> {
        const params = {ID: internalMail.id, Status: 'readed'};

        try {
            await this.dataService.request({
                name: 'markMailAsRead',
                system: 'messages',
                url: `/messages/${internalMail.id}`,
                type: 'POST',
            }, params);

            const readedMail: InternalMailModel = _find(this._mails$.getValue(), (mail: InternalMailModel) => {
                return internalMail.id === mail.id;
            });

            if (!!readedMail) {
                readedMail.readedStatus = true;
            }

            this.readedMailID$.next(internalMail.id);
            this.unreadMailsCount$.next(this.unreadMailsCount$.getValue() - 1);
        } catch (error) {
            this.logService.sendLog({
                code: '19.0.1',
                data: error,
                from: {
                    service: 'InternalMailsService',
                    method: 'markAsRead',
                },
            });

            this.eventService.emit({
                name: 'MESSAGE_MARK_AS_READ_FAILED',
                data: error,
            });
        }
    }

    /**
     * Delete an email from the database and update mails$
     *
     * @param {InternalMailModel} internalMail mail to delete
     * @returns {Promise<void>}
     */
    public async deleteMail(internalMail: InternalMailModel): Promise<void> {
        try {
            await this.dataService.request({
                name: 'deleteMail',
                system: 'messages',
                url: `/messages/${internalMail.id}`,
                type: 'DELETE',
            });
            this._mails$.next(
                _filter(this._mails$.getValue(), (mail: InternalMailModel) => internalMail.id !== mail.id),
            );
        } catch (error) {
            this.logService.sendLog({
                code: '19.0.2',
                data: error,
                from: {
                    service: 'InternalMailsService',
                    method: 'deleteMail',
                },
            });

            this.eventService.emit({
                name: 'MESSAGE_DELETE_FAILED',
                data: error,
            });
        }
    }

    /**
     * Show mail in modal and mark as read
     *
     * @returns {void}
     */
    public openMessage(internalMail: InternalMailModel): void {

        let currentMessage = internalMail;

        if (!currentMessage.personal) {
            try {
                currentMessage = JSON.parse(currentMessage.content)[InternalMailModel.currentLanguage || 'en'];
            }
            catch (error) {
                this.logService.sendLog({
                    code: '19.0.3',
                    data: error,
                    from: {
                        service: 'InternalMailsService',
                        method: 'openMessage',
                    },
                });
            }
        }

        let clearedMsg = GlobalHelper.replaceBrackets(currentMessage.content);

        this.modalService.showModal({
            id: 'internal-mail',
            modalTitle: internalMail.title,
            html: clearedMsg,
            closeBtnText: gettext('Close'),
            showConfirmBtn: true,
            confirmBtnParams: {
                themeMod: 'secondary',
                common: {
                    text: gettext('Delete'),
                },
            },
            onConfirm: () => {
                this.deleteMail(internalMail);
            },
        });

        if (internalMail.status !== 'readed') {
            this.markAsRead(internalMail);
        }
    }

    private async init(): Promise<void> {
        this.registerMethods();

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.fetchMails();
            this.startMailsFetcher();
        }

        InternalMailModel.currentLanguage = this.translateService.currentLang || 'en';
        this.setHandlers();

        this.setNotificationsParams();
        this.setSubscriptions();
    }

    /**
     * Modify mails to InternalMailModels
     *
     * @param {IInternalMail[]} data array to modify
     * @returns {InternalMailModel[]}
     */
    private modifyMails(data: IInternalMail[]): InternalMailModel[] {
        return _map(data, (mailData) => {
            return new InternalMailModel(
                {
                    service: 'InternalMailsService',
                    method: 'modifyMails',
                },
                mailData,
            );
        });
    }

    /**
     * Make a mails request
     *
     * @returns {Promise<void>}
     */
    public async getMails(): Promise<void> {
        this.mailsResponseHandler(await this.dataService.request<IData>('messages/getMails'), 'getMails');
    }

    /**
     * Start fetching mails
     *
     * @returns {Promise<void>}
     */
    private async fetchMails(): Promise<void> {
        try {
            await this.dataService.request('messages/fetchMails', {});
        } catch (error) {
            this.fetchErrorHandler(error, 'fetchMails');
        }
    }

    /**
     * Start mails fetch handler
     *
     * @returns {void}
     */
    private startMailsFetcher(): void {
        this.mailsFetchHandler = this.dataService.subscribe(
            'messages/fetchMails',
            (mailsResponse: IData): void => this.mailsResponseHandler(mailsResponse, 'startMailsFetcher'),
        );
    }

    /**
     * Stop mails fetch handler
     *
     * @returns {void}
     */
    private stopMailsFetcher(): void {
        this.mailsFetchHandler?.unsubscribe();
        this.dataService.reset('messages/fetchMails');
    }

    /**
     * Mails request response handler
     *
     * @param {IData} mailsResponse request response
     * @param {string} fromMethod the method that calls the handler
     *
     * @returns {void}
     */
    private mailsResponseHandler(mailsResponse: IData<IInternalMail[]>, fromMethod: string): void {
        if (!mailsResponse) {
            return;
        }
        try {
            let unreadMails: number = 0;

            this._mails$.next(this.modifyMails(mailsResponse.data));

            unreadMails = _filter(
                this._mails$.getValue(),
                (mail: InternalMailModel): boolean => mail.status === 'new',
            ).length;

            if (this.unreadMailsCount$.getValue() !== unreadMails) {
                this.unreadMailsCount$.next(unreadMails);
            }
        } catch (error) {
            this.fetchErrorHandler(error, 'mailsResponseHandler -> ' + fromMethod);
        } finally {
            this.mailsReady.resolve();
        }
    }

    private fetchErrorHandler(error: Error, method: string): void {
        this.logService.sendLog({
            code: '19.0.0',
            data: error,
            from: {
                service: 'InternalMailsService',
                method: `${method}`,
            },
        });

        this.eventService.emit({
            name: 'MESSAGES_FETCH_FAILED',
            data: error,
        });
    }

    private setHandlers(): void {
        this.eventService.subscribe({name: 'LOGIN'}, () => {
            this.fetchMails();
            this.startMailsFetcher();
        });

        this.eventService.subscribe({name: 'LOGOUT'}, () => {
            this.stopMailsFetcher();
            this._mails$.next([]);
            this.unreadMailsCount$.next(0);
        });

        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (InternalMailModel.currentLanguage !== lang) {
                InternalMailModel.currentLanguage = lang;
            }
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'fetchMails',
            system: 'messages',
            url: '/messages',
            type: 'GET',
            period: 60000,
        });
        this.dataService.registerMethod({
            name: 'getMails',
            system: 'messages',
            url: '/messages',
            type: 'GET',
        });
    }

    private setSubscriptions(): void {
        this.mails$.subscribe((mails: InternalMailModel[]): void => {
            this.newMails = mails.filter((mail) => mail.status === 'new');
            if (this.newMails.length && !this.isRestrictedState()) {
                let date = DateTime.fromSQL(this.newMails[0].dateISO);
                if (!this.getLastMessageTime() && this.newMails.length) {
                    this.setLastMessageTime();

                    for (let i = this.notificationsParams.numberOfNotifications - 1; i >= 0; i--) {
                        if (this.newMails[i]) {
                            this.displayMessageByIndex(i);
                        }
                    }
                } else if (this.getLastMessageTime()
                    && date > this.getLastMessageTime()) {
                    this.setLastMessageTime();
                    this.displayMessageByIndex(0);
                }
            }
        });

        this.eventService.subscribe({
            name: 'LOGOUT',
        }, () => {
            this.removeLastMessageTime();
            this.eventService.emit({
                name: NotificationEvents.DismissAll,
            });
        });
    }

    private setNotificationsParams(): void {
        this.notificationsParams = _mergeWith(
            this.notificationsParams,
            this.configService.get<IMailNotificationsParams>('$base.profile.messages.notificationsParams'),
        );
    }

    private getLastMessageTime(): DateTime | null {
        const date: string | null = this.configService.get({
            name: 'lastMessageTime',
            storageType: 'sessionStorage',
        });

        return date ? DateTime.fromSQL(date) : null;
    }

    private setLastMessageTime(): void {
        this.configService.set({
            name: 'lastMessageTime',
            value: this.newMails[0].dateISO,
            storageType: 'sessionStorage',
        });
    }

    private removeLastMessageTime(): void {
        this.configService.set({
            name: 'lastMessageTime',
            value: null,
            storageType: 'sessionStorage',
        });
    }

    private displayMessageByIndex(index: number): void {
        let currentMessage = this.newMails[index];

        if (!currentMessage.personal) {
            try {
                currentMessage = JSON.parse(currentMessage.content)[InternalMailModel.currentLanguage || 'en'];
            }
            catch (error) {
                this.logService.sendLog({
                    code: '19.0.3',
                    data: error,
                    from: {
                        service: 'InternalMailsService',
                        method: 'displayMessageByIndex',
                    },
                });
            }
        }

        let clearedMsg = GlobalHelper.replaceBrackets(currentMessage.content);

        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: <IPushMessageParams>{
                type: 'message',
                title: gettext(currentMessage.title),
                message: gettext(clearedMsg),

                action: {
                    label: gettext('Read more'),
                    onClick: () => {
                        this.openMessage(currentMessage);
                        this.eventService.emit({
                            name: NotificationEvents.DismissAll,
                        });
                    },
                },
            },
        });
    }

    private isRestrictedState(): boolean {
        return this.notificationsParams.excludedStatesForNotifications.some(state => this.stateService.is(state));
    }
}
