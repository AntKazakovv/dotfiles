import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {Component} from '@angular/core';
import {CompilerModule} from 'wlc-engine/modules/compiler/compiler.module';
import {DynamicHtmlComponent} from 'wlc-engine/modules/compiler/components/dynamic-html/dynamic-html.component';
import {WINDOW} from 'wlc-engine/modules/app/system/tokens/window';

@Component({
    selector: '[wlc-test-component]',
    template: '<div wlc-dynamic-html ' +
        '[withoutCompilation]="withoutCompilation" ' +
        '[shouldClearStyles]="shouldClearStyles" ' +
        '[canUseScriptTag]="canUseScriptTag" ' +
        '[html]="html"></div>',
})
export class TestComponent {
    public withoutCompilation: boolean;
    public shouldClearStyles: boolean;
    public canUseScriptTag: boolean;
    public html: string;
}

describe('DynamicHtml', () => {
    const injectParams = {};
    let component: TestComponent;
    let fixture: ComponentFixture<TestComponent>;
    let nativeElement: HTMLElement;
    let window: Window;

    beforeEach((() => {
        fixture = TestBed.configureTestingModule({
            imports: [AppModule, CompilerModule],
            declarations: [DynamicHtmlComponent, TestComponent],
            providers: [
                {
                    provide: 'injectParams',
                    useValue: injectParams,
                },
            ],
        }).createComponent(TestComponent);
        component = fixture.componentInstance;
        nativeElement = fixture.nativeElement;
        window = TestBed.inject<Window>(WINDOW);
    }));

    it('-> should be created', () => {
        expect(nativeElement).toBeTruthy();
    });

    it('-> should compile angular component', () => {
        component.html = '<button wlc-button text="test"></button>';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            const button = nativeElement.querySelector('.wlc-btn');
            expect(button).not.toBeNull();
            const innerButton = button.querySelector('span');
            expect(innerButton.innerHTML).toContain('test');
        });
    });

    it('-> should compile html without compilation', () => {
        component.html = '<button wlc-button text="test"></button>';
        component.withoutCompilation = true;
        fixture.detectChanges();
        const button = nativeElement.querySelector('button:not(.wlc-btn)');
        expect(button).not.toBeNull();
    });

    it('-> should remove inline styles from html', () => {
        component.html = '<button style="color: #000"></button>';
        component.withoutCompilation = true;
        component.shouldClearStyles = true;
        fixture.detectChanges();
        const button = nativeElement.querySelector('button');
        expect(button.getAttribute('style')).toBeNull();
    });

    it('-> should enable manual script tag add to component', () => {
        component.canUseScriptTag = true;
        component.html = '<button wlc-button text="test"></button><script>window["test"] = true</script>';
        fixture.detectChanges();
        fixture.whenStable().then(() => {
            expect(window['test']).toBeTrue();
        });
    });
});
