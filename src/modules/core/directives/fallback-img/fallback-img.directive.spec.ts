import {
    Component,
    DebugElement,
} from '@angular/core';
import {
    TestBed,
} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

import {FallbackImgDirective} from './fallback-img.directive';

@Component({
    template: `<div>
        <img [wlc-fallback]="'https://devcasino.egamings.com/img.jpg'"
             [src]="'https://devcasino.egamings.com/img2.jpg'"
             loading="lazy">
    </div>`,
})
class TestComponent {
}

describe('FallbackImgDirective', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                FallbackImgDirective,
                TestComponent,
            ],
        }).compileComponents();
    });

    it('-> check that fallback was applied', () => {
        const fixture = TestBed.createComponent(TestComponent);
        fixture.detectChanges();

        const img: DebugElement = fixture.debugElement.query(
            By.directive(FallbackImgDirective),
        );
        img.nativeElement.dispatchEvent(new Event('error'));
        fixture.detectChanges();

        expect(img.attributes['src']).toBe('https://devcasino.egamings.com/img.jpg');
    });
});
