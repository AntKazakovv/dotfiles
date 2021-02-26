import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BirthdayFieldComponent} from 'wlc-engine/modules/core/components/birthday-field/birthday-field.component';

describe('BirthdayFieldComponent', () => {
    let component: BirthdayFieldComponent;
    let fixture: ComponentFixture<BirthdayFieldComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BirthdayFieldComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BirthdayFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
