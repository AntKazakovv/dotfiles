/* import {EventEmitter} from '@angular/core';
import {StateService} from '@uirouter/core';
import {
    fakeAsync,
    TestBed,
    flushMicrotasks,
} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';

import _assign from 'lodash-es/assign';
import _find from 'lodash-es/find';
import {first} from 'rxjs';

import {
    ConfigService,
    DataService,
    EventService,
    IData,
    LogService,
    ModalService,
} from 'wlc-engine/modules/core';
import {IInternalMail} from 'wlc-engine/modules/internal-mails/system/interfaces/internal-mails.interface';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';
import {InternalMailsService} from './internal-mails.service';

describe('InternalMailsService', (): void => {
    const getMail = (fields?: Partial<IInternalMail>): jasmine.SpyObj<IInternalMail> => {
        return jasmine.createSpyObj<IInternalMail>('mail', [], _assign({
            Content: 'Simple mail content',
            Created: '2022-06-24 10:20:30',
            ID: '0',
            IsEvent: '0',
            Name: 'Simple mail name',
            Status: 'new',
            Personal: '1',
        }, fields));
    };

    let internalMailsService: InternalMailsService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;
    let eventServiceSpy: jasmine.SpyObj<EventService>;
    let dataServiceSpy: jasmine.SpyObj<DataService>;
    let logServiceSpy: jasmine.SpyObj<LogService>;
    let translateServiceSpy: jasmine.SpyObj<TranslateService>;
    let modalServiceSpy: jasmine.SpyObj<ModalService>;
    let stateServiceSpy: jasmine.SpyObj<StateService>;

    beforeEach(fakeAsync((): void => {
        const mailsReq: Partial<IData<IInternalMail[]>> = {
            data: [
                getMail({ID: '1'}),
                getMail({ID: '2'}),
                getMail({ID: '3'}),
                getMail({ID: '4', Status: 'readed'}),
                getMail({ID: '5'}),
            ],
        };

        configServiceSpy = jasmine.createSpyObj('ConfigService', ['get', 'set']);
        eventServiceSpy = jasmine.createSpyObj('EventService', ['emit', 'subscribe']);
        dataServiceSpy = jasmine.createSpyObj('DataService', ['subscribe', 'registerMethod', 'request', 'reset']);
        logServiceSpy = jasmine.createSpyObj('LogService', ['sendLog']);
        translateServiceSpy = jasmine.createSpyObj('TranslateService', [], {
            currentLang: 'en',
            onLangChange: new EventEmitter,
        });
        modalServiceSpy = jasmine.createSpyObj('ModalService', ['showModal']);
        stateServiceSpy = jasmine.createSpyObj('StateService', ['is']);

        configServiceSpy.get.withArgs({
            name: 'lastMessageTime',
            storageType: 'sessionStorage',
        }).and.returnValue(null);
        configServiceSpy.set.and.returnValue(null);
        configServiceSpy.get.withArgs('$user.isAuthenticated').and.returnValue(true);
        configServiceSpy.get.withArgs('$base.profile.messages.notificationsParams').and.returnValue({});
        dataServiceSpy.request.and.resolveTo({});
        dataServiceSpy.request.withArgs('messages/getMails').and.resolveTo(mailsReq);

        TestBed.configureTestingModule({
            providers: [
                InternalMailsService,
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
                {
                    provide: EventService,
                    useValue: eventServiceSpy,
                },
                {
                    provide: DataService,
                    useValue: dataServiceSpy,
                },
                {
                    provide: LogService,
                    useValue: logServiceSpy,
                },
                {
                    provide: TranslateService,
                    useValue: translateServiceSpy,
                },
                {
                    provide: ModalService,
                    useValue: modalServiceSpy,
                },
                {
                    provide: StateService,
                    useValue: stateServiceSpy,
                },
            ],
        });

        internalMailsService = TestBed.inject(InternalMailsService);

        internalMailsService.getMails();
    }));

    it('-> should be created', (): void => {
        expect(internalMailsService).toBeTruthy();
    });

    it('-> check mails number', (done): void => {
        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                expect(mails.length).toBe(5);
                done();
            });
    });

    it('-> check unread count', (): void => {
        expect(internalMailsService.unreadMailsCount$.getValue()).toBe(4);
    });

    it('-> check readedMailID subject after markAsRead', (done): void => {
        internalMailsService.readedMailID$
            .subscribe((id: string): void => {
                expect(id).toBe('1');
                done();
            });

        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                internalMailsService.markAsRead(mails[0]);
            });
    });

    it('-> check unreadMailsCount after markAsRead', fakeAsync((): void => {
        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                internalMailsService.markAsRead(mails[0]);
            });
        flushMicrotasks();

        expect(internalMailsService.unreadMailsCount$.getValue()).toBe(3);
    }));

    it('-> check mails$.length after deleteMail', fakeAsync((): void => {
        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                internalMailsService.deleteMail(mails[0]);
            });
        flushMicrotasks();

        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                expect(mails.length).toBe(4);
            });
    }));

    it(
        '-> check that after deleteMail in emails$ there is no mail left with the corresponding id',
        fakeAsync((): void => {
            let mailsList: InternalMailModel[];
            let deletedMail: InternalMailModel;

            internalMailsService.mails$
                .pipe(first())
                .subscribe((mails: InternalMailModel[]): void => {
                    deletedMail = mails[0];
                });
            flushMicrotasks();

            internalMailsService.deleteMail(deletedMail);
            flushMicrotasks();

            internalMailsService.mails$
                .pipe(first())
                .subscribe((mails: InternalMailModel[]): void => {
                    mailsList = mails;
                });
            flushMicrotasks();

            expect(
                _find(
                    mailsList,
                    {id: deletedMail.id},
                ),
            ).toBeUndefined();
        }),
    );

    it('-> check unreadMailsCount after openMessage', fakeAsync((): void => {
        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                internalMailsService.openMessage(mails[0]);
            });
        flushMicrotasks();

        expect(internalMailsService.unreadMailsCount$.getValue()).toBe(3);
    }));

    it('-> check modalService.showModal called when we call openMessage', fakeAsync((): void => {
        internalMailsService.mails$
            .pipe(first())
            .subscribe((mails: InternalMailModel[]): void => {
                internalMailsService.openMessage(mails[0]);
            });
        flushMicrotasks();

        expect(modalServiceSpy.showModal).toHaveBeenCalled();
    }));
});
 */
