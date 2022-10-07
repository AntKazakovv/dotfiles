import {
    Component,
    Input,
} from '@angular/core';
import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {
    ConfigService,
    ModalService,
} from 'wlc-engine/modules/core';
import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';
import {OpenMailBtnComponent} from './open-mail-btn.component';
import * as Params from './open-mail-btn.params';

interface IOpenMailMessageBtnMock extends Omit<Params.IOpenMailMessageBtn, 'internalMail'> {
    internalMail: Partial<Readonly<InternalMailModel>>
}

interface setupParams {
    isProfileFirst?: boolean,
    isMailReaded?: boolean,
}

interface IConfigServiceStub extends Partial<Omit<ConfigService, 'get'>> {
    get(): {};
}

interface IModalServiceStub extends Partial<Omit<ModalService, 'showModal'>> {
    showModal(): Promise<void>;
}

describe('OpenMailBtnComponent', (): void => {

    let component: OpenMailBtnComponent;
    let fixture: ComponentFixture<OpenMailBtnComponent>;
    let nativeElement: HTMLElement;
    let injectParams: IOpenMailMessageBtnMock;

    let internalMailsServiceStub: Partial<InternalMailsService>;
    let modalServiceStub: IModalServiceStub;
    let configServiceStub: IConfigServiceStub;

    let configGetSpy: jasmine.Spy;
    let markAsReadSpy: jasmine.Spy;
    let showModalSpy: jasmine.Spy;

    const setup = (setupParams?: setupParams): void => {
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-open-mail-btn',
            internalMail: {
                date: '24-06-2022 13:39',
                status: setupParams?.isMailReaded ? 'readed' : 'new',
            },
        };

        internalMailsServiceStub = {
            deleteMail() {
                return Promise.resolve();
            },
            markAsRead() {
                return Promise.resolve();
            },
        };
        modalServiceStub = {
            showModal() {
                return Promise.resolve();
            },
        };
        configServiceStub = {
            get() {
                return {};
            },
        };

        TestBed.configureTestingModule({
            declarations: [
                OpenMailBtnComponent,
                ButtonComponent,
            ],
            providers: [
                {provide: InternalMailsService, useValue: internalMailsServiceStub},
                {provide: ModalService, useValue: modalServiceStub},
                {provide: ConfigService, useValue: configServiceStub},
                {provide: 'injectParams', useValue: injectParams},
            ],
        });

        markAsReadSpy = spyOn(TestBed.inject(InternalMailsService), 'markAsRead');
        showModalSpy = spyOn(TestBed.inject(ModalService), 'showModal');
        configGetSpy = spyOn(TestBed.inject(ConfigService), 'get');

        configGetSpy.and.returnValue(setupParams?.isProfileFirst ? 'first' : 'default');

        fixture = TestBed.createComponent(OpenMailBtnComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
    };

    it('should create', (): void => {
        setup();
        expect(component).toBeDefined();
    });

    it('-> check that host has profile-first class in first profile', (): void => {
        setup({isProfileFirst: true});
        expect(nativeElement.getAttribute('class')).toContain('profile-first');
    });

    it('-> check that host has NOT profile-first in default profile', (): void => {
        setup();
        expect(nativeElement.getAttribute('class')).not.toContain('profile-first');
    });

    it('-> check internalMailsService.markAsRead called when call openMessage with UNread message', (): void => {
        setup();
        component.openMessage();
        expect(markAsReadSpy).toHaveBeenCalled();
    });

    it('-> check internalMailsService.markAsRead NOT called when call openMessage with read message', (): void => {
        setup({isMailReaded: true});
        component.openMessage();
        expect(markAsReadSpy).not.toHaveBeenCalled();
    });

    it('-> check modalService.showModal called when we call openMessage', (): void => {
        setup();
        component.openMessage();
        expect(showModalSpy).toHaveBeenCalled();
    });

    it('-> check action-text', (): void => {
        setup();
        expect(nativeElement.querySelector('.action-text').textContent)
            .toBe(injectParams.internalMail.date);
    });
});

@Component({selector: '[wlc-button]'})
class ButtonComponent {
    @Input() inlineParams;
}
