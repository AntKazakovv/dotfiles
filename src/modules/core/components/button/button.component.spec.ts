import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {TranslatePipe} from '@ngx-translate/core';
import {StateService} from '@uirouter/core';
import {
    MockComponent,
    MockPipe,
    MockService,
} from 'ng-mocks';

import {WINDOW_PROVIDER} from 'wlc-engine/modules/app/system';
import {IconComponent} from 'wlc-engine/modules/core/components/icon/icon.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {EventService} from 'wlc-engine/modules/core/system/services/event/event.service';

import {ButtonComponent} from './button.component';
import {defaultParams} from './button.params';

describe('ButtonComponent', () => {
    let component: ButtonComponent;
    let fixture: ComponentFixture<ButtonComponent>;
    let nativeElement: HTMLElement;

    const injectParams = {
        wlcElement: 'button_submit',
        theme: 'cleared',
        themeMod: 'secondary',
        common: {
            iconPath: '/wlc/icons/search.svg',
            text: 'some text',
        },
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                ButtonComponent,
                MockComponent(IconComponent),
                MockPipe(TranslatePipe, value => value),
            ],
            providers: [
                WINDOW_PROVIDER,
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
                {
                    provide: ConfigService,
                    useValue: MockService(ConfigService),
                },
                {
                    provide: StateService,
                    useValue: MockService(StateService),
                },
                {
                    provide: EventService,
                    useValue: MockService(EventService),
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ButtonComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;

        fixture.detectChanges();
    });

    it('-> should be created', () => {
        expect(component).toBeTruthy();
    });

    it('-> checking text output', () => {
        expect(nativeElement
            .querySelector(`.${defaultParams.class} .${defaultParams.class}__text`)
            .innerHTML
            .includes(injectParams.common.text),
        ).toEqual(true);
    });

    it('-> checking for svg presence', () => {
        const icon = nativeElement.querySelector('[wlc-icon]');

        expect(icon).toEqual(jasmine.anything());
        expect(icon.getAttribute('ng-reflect-icon-path')).toEqual(injectParams.common.iconPath);
    });

    it('-> checking for the presence of an attribute', () => {
        expect(nativeElement.getAttribute('data-wlc-element')).toEqual(injectParams.wlcElement);
    });

    it('-> checking for the presence of an class', () => {
        const classes = nativeElement.getAttribute('class');

        expect(classes.includes(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--type-default`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--size-default`)).toBeTrue();
    });
});
