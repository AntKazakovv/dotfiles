import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificationGroupComponent } from './verification-group.component';

describe('VerificationGroupComponent', () => {
    let component: VerificationGroupComponent;
    let fixture: ComponentFixture<VerificationGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ VerificationGroupComponent ],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(VerificationGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
