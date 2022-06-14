import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import _each from 'lodash-es/each';
import _trim from 'lodash-es/trim';

import {AppModule} from 'wlc-engine/modules/app/app.module';
import {AccordionComponent} from './accordion.component';
import {
    IAccordionCParams,
    defaultParams,
} from './accordion.params';

describe('AccordionComponent', (): void => {
    let component: AccordionComponent;
    let fixture: ComponentFixture<AccordionComponent>;
    let nativeElement: HTMLElement;

    const injectParams: IAccordionCParams = {
        theme: 'default',
        themeMod: 'default',
        type: 'default',
        wlcElement: 'wlc-accordion',
        title: 'Possible rewards',
        titleIconPath: '/wlc/icons/arrow.svg',
        items: Array(3).fill({
            title: 'Simple title',
            content: 'Simple content',
            expand: false,
        }),
    };

    beforeEach((): void => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [AccordionComponent],
            providers: [{
                provide: 'injectParams',
                useValue: injectParams,
            }],
        }).compileComponents();

        fixture = TestBed.createComponent(AccordionComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('-> should be created', (): void => {
        expect(component).toBeTruthy();
    });

    it('-> checking for the presence of an attribute', (): void => {
        expect(nativeElement.getAttribute('data-wlc-element')).toEqual(injectParams.wlcElement);
    });

    it('-> checking for the presence of an class', (): void => {
        const classes = nativeElement.getAttribute('class');

        expect(classes.includes(`${defaultParams.class}--theme-${injectParams.theme}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--theme-mod-${injectParams.themeMod}`)).toBeTrue();
        expect(classes.includes(`${defaultParams.class}--type-${injectParams.type}`)).toBeTrue();
    });

    it('-> checking for svg presence', (): void => {
        const icon = nativeElement.querySelector('[wlc-icon]');

        expect(icon).toEqual(jasmine.anything());
        expect(icon.getAttribute('ng-reflect-icon-path')).toEqual(injectParams.titleIconPath);
    });

    it('-> checking for title', (): void => {
        expect(nativeElement.querySelector(`.${defaultParams.class}__header-title`).textContent)
            .toEqual(injectParams.title);
    });

    it('-> checking for amount items and content', (): void => {
        const items: NodeListOf<Element> = nativeElement.querySelectorAll(`.${defaultParams.class}__item`);
        expect(items.length).toEqual(3);

        _each(items, (item: Element, index: number): void => {
            expect(item.querySelector(`.${defaultParams.class}__title-text`).textContent)
                .toEqual(injectParams.items[index].title);
            expect(_trim(item.querySelector(`.${defaultParams.class}__content-wrp`).textContent))
                .toEqual(injectParams.items[index].content);
            expect(item.querySelector(`.${defaultParams.class}__title-icon`).getAttribute('ng-reflect-icon-path'))
                .toEqual(injectParams.titleIconPath);
        });
    });

    it('-> checking for expanded item', (): void => {
        component.ngOnInit();
        component.items[0].expand = true;
        fixture.detectChanges();
        expect(!!nativeElement.querySelector(`.${defaultParams.class}__item.expanded`)).toBeTrue();
    });
});
