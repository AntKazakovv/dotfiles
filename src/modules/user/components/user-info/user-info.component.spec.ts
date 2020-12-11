import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {InputComponent} from 'wlc-engine/modules/user/components/user-info/user-info.component';

describe('UserInfoComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ InputComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
