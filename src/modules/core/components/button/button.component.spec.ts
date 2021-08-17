import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
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
            imports: [AppModule],
            declarations: [ButtonComponent],
            providers: [{
                provide: 'injectParams',
                useValue: injectParams,
            }],
        }).compileComponents();
    });

    beforeEach(() => {
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

        expect(classes.includes(`${defaultParams.class}--theme-${injectParams.theme}`)).toEqual(true);
        expect(classes.includes(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toEqual(true);
        expect(classes.includes(`${defaultParams.class}--type-default`)).toEqual(true);
        expect(classes.includes(`${defaultParams.class}--size-default`)).toEqual(true);
    });
});
