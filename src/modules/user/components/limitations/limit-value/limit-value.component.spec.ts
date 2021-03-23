import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LimitValueComponent} from './limit-value.component';

describe('LimitValueComponent', () => {
    let component: LimitValueComponent;
    let fixture: ComponentFixture<LimitValueComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitValueComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LimitValueComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
