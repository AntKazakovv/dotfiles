import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {SocialSignUpFormComponent} from './social-sign-up-form.component';

describe('SocialSignUpFormComponent', () => {
    let component: SocialSignUpFormComponent;
    let fixture: ComponentFixture <SocialSignUpFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SocialSignUpFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SocialSignUpFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
