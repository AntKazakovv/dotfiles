import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PhoneFieldComponent} from 'wlc-engine/modules/user/components/phone-field/phone-field.component';

describe('PhoneField', () => {
    let component: PhoneFieldComponent;
    let fixture: ComponentFixture<PhoneFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [PhoneFieldComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PhoneFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
