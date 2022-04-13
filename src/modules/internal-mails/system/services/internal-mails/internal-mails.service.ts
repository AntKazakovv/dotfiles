import {Injectable} from '@angular/core';
import {
    LangChangeEvent,
    TranslateService,
} from '@ngx-translate/core';

import {
    BehaviorSubject,
    Subject,
    Subscription,
} from 'rxjs';
import _map from 'lodash-es/map';
import _filter from 'lodash-es/filter';
import _find from 'lodash-es/find';

import {
    ConfigService,
    DataService,
    EventService,
    LogService,
} from 'wlc-engine/modules/core';
import {IInternalMail} from 'wlc-engine/modules/internal-mails/system/interfaces';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models';

@Injectable({
    providedIn: 'root',
})
export class InternalMailsService {
    public mails$: BehaviorSubject<InternalMailModel[]> = new BehaviorSubject([]);
    public mailsReady$: Subject<boolean> = new BehaviorSubject(false);
    public unreadMailsCount$: BehaviorSubject<number> = new BehaviorSubject(0);
    public readedMailID$: Subject<string> = new Subject();
    public currentLang: string;
    private mailsFetchHandler: Subscription;

    constructor(
        private dataService: DataService,
        private eventService: EventService,
        private logService: LogService,
        private configService: ConfigService,
        private translateService: TranslateService,
    ) {
        this.init();
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

            const readedMail: InternalMailModel = _find(this.mails$.getValue(), (mail: InternalMailModel) => {
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
            this.mails$.next(
                _filter(this.mails$.getValue(), (mail: InternalMailModel) => internalMail.id !== mail.id),
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

    private async init(): Promise<void> {
        this.registerMethods();

        if (this.configService.get<boolean>('$user.isAuthenticated')) {
            this.fetchMails();
            this.startMailsFetcher();
        }

        InternalMailModel.language = this.translateService.currentLang || 'en';
        this.setHandlers();
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
     * Start fetching mails
     */
    private async fetchMails(): Promise<void> {
        try {
            await this.dataService.request('messages/getMails', {});
        } catch (error) {
            this.fetchErrorHandler(error, 'fetchMails');
        }
    }

    /**
     * Start mails fetch handler
     */
    private startMailsFetcher(): void {
        this.mailsFetchHandler = this.dataService.subscribe('messages/getMails', (mails) => {
            try {
                let unreadMails: number = 0;

                this.mails$.next(this.modifyMails(mails.data));

                unreadMails = _filter(
                    this.mails$.getValue(),
                    (mail: InternalMailModel) => mail.status === 'new',
                ).length;

                if (this.unreadMailsCount$.getValue() !== unreadMails) {
                    this.unreadMailsCount$.next(unreadMails);
                }
            } catch (error) {
                this.fetchErrorHandler(error, 'startMailsFetcher');
            } finally {
                this.mailsReady$.next(true);
            }
        });
    }

    /**
     * Stop mails fetch handler
     */
    private stopMailsFetcher(): void {
        this.mailsFetchHandler?.unsubscribe();
        this.dataService.reset('messages/getMails');
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
            this.mails$.next([]);
            this.unreadMailsCount$.next(0);
        });

        this.translateService.onLangChange.subscribe(({lang}: LangChangeEvent) => {
            if (InternalMailModel.language !== lang) {
                InternalMailModel.language = lang;
            }
        });
    }

    private registerMethods(): void {
        this.dataService.registerMethod({
            name: 'getMails',
            system: 'messages',
            url: '/messages',
            type: 'GET',
            period: 60000,
        });
    }
}
