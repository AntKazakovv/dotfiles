import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {MenuComponent} from './menu.component';
import {
    defaultParams,
    IMenuCParams,
} from './menu.params';

describe('MenuComponent', () => {
    let component: MenuComponent;
    let fixture: ComponentFixture<MenuComponent>;
    let nativeElement: HTMLElement;

    function createComponent(injectParams: IMenuCParams): void {
        TestBed.overrideProvider(
            'injectParams', {
                useValue: injectParams,
            });

        fixture = TestBed.createComponent(MenuComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        fixture.detectChanges();
    }

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule],
            declarations: [MenuComponent],
        }).compileComponents();
    });

    it('-> should be created', () => {
        createComponent(defaultParams);
        expect(component).toBeTruthy();
    });

    it('-> setExtension: check set fallback with png extension', () => {
        createComponent({
            moduleName: 'menu',
            componentName: 'wlc-menu',
            theme: 'default',
            common: {
                icons: {
                    extension: 'png',
                    fallback: 'plug',
                },
            },
        });
        expect(component.iconsFallback).toEqual('plug.png');
    });
});
