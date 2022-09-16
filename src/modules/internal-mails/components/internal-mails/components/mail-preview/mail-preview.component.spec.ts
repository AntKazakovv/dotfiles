import {
    Component,
    Input,
    Pipe,
    PipeTransform,
} from '@angular/core';
import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {Subject} from 'rxjs';

import {InternalMailModel} from 'wlc-engine/modules/internal-mails/system/models/internal-mail.model';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';
import {ProfileMessagePreviewComponent} from './mail-preview.component';
import * as Params from './mail-preview.params';

describe('ProfileMessagePreviewComponent', (): void => {
    interface IMailPreviewCParamsMock extends Omit<Params.IMailPreviewCParams, 'internalMail'> {
        internalMail: Partial<Readonly<InternalMailModel>>
    }

    let component: ProfileMessagePreviewComponent;
    let fixture: ComponentFixture<ProfileMessagePreviewComponent>;
    let nativeElement: HTMLElement;
    let injectParams: IMailPreviewCParamsMock;
    let defaultParams: Partial<Params.IMailPreviewCParams> = Params.defaultParams;

    let internalMailsServiceStub: Partial<InternalMailsService>;

    const readMailPath: string = '/wlc/icons/mails/read-mail.svg';
    const unreadMailPath: string = '/wlc/icons/mails/unread-mail.svg';

    beforeEach((): void => {
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-mail-preview',
            internalMail: {
                id: '1',
                date: '24-06-2022 13:39',
                from: 'Administration',
                status: 'new',
            },
        };

        internalMailsServiceStub = {
            readedMailID$: new Subject(),
        };

        TestBed.configureTestingModule({
            declarations: [
                ProfileMessagePreviewComponent,
                IconComponent,
                TranslatePipe,
            ],
            providers: [
                {provide: InternalMailsService, useValue: internalMailsServiceStub},
                {provide: 'injectParams', useValue: injectParams},
            ],
        });

        fixture = TestBed.createComponent(ProfileMessagePreviewComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component).toBeDefined();
    });

    it('-> check public fields at start', (): void => {
        expect(component.date).withContext('date field').toBe(injectParams.internalMail.date);
        expect(component.from).withContext('from field').toBe(injectParams.internalMail.from);
        expect(component.iconPath).withContext('iconPath field').toBe(unreadMailPath);
    });

    it('-> check iconPath after readedMailID$ push current mail id', (): void => {
        internalMailsServiceStub.readedMailID$.next('1');
        expect(component.iconPath).withContext('iconPath field').toBe(readMailPath);
    });

    it('-> check iconPath after readedMailID$ push NOT current mail id', (): void => {
        internalMailsServiceStub.readedMailID$.next('3');
        expect(component.iconPath).withContext('iconPath field').toBe(unreadMailPath);
    });

    it('-> check from in template', (): void => {
        expect(nativeElement.querySelector(`.${defaultParams.class}__from`).textContent)
            .toBe(injectParams.internalMail.from);
    });

    it('-> check date in template', (): void => {
        expect(nativeElement.querySelector(`.${defaultParams.class}__date`).textContent)
            .toBe(injectParams.internalMail.date);
    });
});

@Pipe({
    name: 'translate',
})
export class TranslatePipe implements PipeTransform {
    transform(value: string): string {
        return value;
    }
}

@Component({selector: '[wlc-icon]'})
class IconComponent {
    @Input() iconPath: string;
}
