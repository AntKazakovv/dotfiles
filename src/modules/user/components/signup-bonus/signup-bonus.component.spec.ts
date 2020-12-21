import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SignupBonusComponent} from './signup-bonus.component';

describe('SignupBonusComponent', () => {
    let component: SignupBonusComponent;
    let fixture: ComponentFixture<SignupBonusComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SignupBonusComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupBonusComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
