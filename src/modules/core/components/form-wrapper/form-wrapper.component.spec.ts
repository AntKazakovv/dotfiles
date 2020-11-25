import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {WrapperComponent} from 'wlc-engine/modules/core/components/wrapper/wrapper.component';

describe('WrapperComponent', () => {
    let component: WrapperComponent;
    let fixture: ComponentFixture<WrapperComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WrapperComponent ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WrapperComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
