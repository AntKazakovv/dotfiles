import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {FormControlComponent} from 'wlc-engine/modules/core/components/form-control/form-control.component';

describe('FormControlComponent', () => {
    let component: FormControlComponent;
    let fixture: ComponentFixture<FormControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ FormControlComponent ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
