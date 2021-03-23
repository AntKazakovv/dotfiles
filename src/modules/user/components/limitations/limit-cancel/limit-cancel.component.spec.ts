import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LimitCancelComponent} from './limit-cancel.component';

describe('LimitCancelComponent', () => {
    let component: LimitCancelComponent;
    let fixture: ComponentFixture<LimitCancelComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitCancelComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LimitCancelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
