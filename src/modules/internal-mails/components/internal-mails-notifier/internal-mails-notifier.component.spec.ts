import {
    Component,
    Input,
} from '@angular/core';
import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {BehaviorSubject} from 'rxjs';

import {ConfigService} from 'wlc-engine/modules/core';
import {
    InternalMailsService,
} from 'wlc-engine/modules/internal-mails/system/services/internal-mails/internal-mails.service';
import {InternalMailsNotifierComponent} from './internal-mails-notifier.component';
import * as Params from './internal-mails-notifier.params';

interface IConfigServiceStub extends Partial<Omit<ConfigService, 'get'>> {
    get(): {};
}

describe('InternalMailsNotifierComponent', (): void => {
    let component: InternalMailsNotifierComponent;
    let fixture: ComponentFixture<InternalMailsNotifierComponent>;
    let nativeElement: HTMLElement;
    let injectParams: Params.IInternalMailsNotifierCParams;
    let defaultParams: Params.IInternalMailsNotifierCParams = Params.defaultParams;

    let internalMailsServiceStub: Partial<InternalMailsService>;
    let configServiceStub: IConfigServiceStub;

    beforeEach((): void => {
        injectParams = {
            theme: 'default',
            themeMod: 'default',
            type: 'default',
            wlcElement: 'wlc-internal-mails-notifier',
        };

        internalMailsServiceStub = {
            unreadMailsCount$: new BehaviorSubject(0),
        };
        configServiceStub = {
            get() {
                return {};
            },
        };

        TestBed.configureTestingModule({
            declarations: [
                InternalMailsNotifierComponent,
                CounterComponent,
                ButtonComponent,
            ],
            providers: [
                {provide: InternalMailsService, useValue: internalMailsServiceStub},
                {provide: ConfigService, useValue: configServiceStub},
                {provide: 'injectParams', useValue: injectParams},
            ],
        });

        fixture = TestBed.createComponent(InternalMailsNotifierComponent);
        nativeElement = fixture.nativeElement;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', (): void => {
        expect(component).toBeDefined();
    });

    it('-> check hasUnread at unreadMailsCount$ changes', (): void => {
        expect(component.hasUnread).withContext('at start').toBeFalse();

        internalMailsServiceStub.unreadMailsCount$.next(1);
        expect(component.hasUnread).withContext('after push 1').toBeTrue();

        internalMailsServiceStub.unreadMailsCount$.next(0);
        expect(component.hasUnread).withContext('after push 0').toBeFalse();

        internalMailsServiceStub.unreadMailsCount$.next(10);
        expect(component.hasUnread).withContext('after push 10').toBeTrue();
    });

    it('-> check wlc-counter in template after hasUnread toggle', (): void => {
        expect(nativeElement.querySelector(`${defaultParams.class}__counter`))
            .withContext('at start')
            .not
            .toEqual(jasmine.anything());

        component.ngOnInit();
        component.hasUnread = true;
        fixture.detectChanges();

        expect(nativeElement.querySelector(`.${defaultParams.class}__counter`))
            .withContext('toggle to true')
            .toEqual(jasmine.anything());

        component.hasUnread = false;
        fixture.detectChanges();
        expect(nativeElement.querySelector(`${defaultParams.class}__counter`))
            .withContext('toggle to false')
            .not
            .toEqual(jasmine.anything());
    });

    it('-> check button has-unread class after hasUnread toggle', (): void => {
        expect(nativeElement.querySelector('button').getAttribute('class'))
            .withContext('at start')
            .not
            .toContain('has-unread');

        component.ngOnInit();
        component.hasUnread = true;
        fixture.detectChanges();
        expect(nativeElement.querySelector('button').getAttribute('class'))
            .withContext('toggle to true')
            .toContain('has-unread');

        component.ngOnInit();
        component.hasUnread = false;
        expect(nativeElement.querySelector('button').getAttribute('class'))
            .withContext('toggle to false')
            .not
            .toContain('has-unread');
    });
});

@Component({selector: '[wlc-counter]'})
class CounterComponent {
    @Input() inlineParams;
}

@Component({selector: '[wlc-button]'})
class ButtonComponent {
    @Input() inlineParams;
}
