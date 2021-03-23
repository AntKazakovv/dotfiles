import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RealityCheckInfoComponent} from './reality-check-info.component';

describe('RealityCheckInfoComponent', () => {
    let component: RealityCheckInfoComponent;
    let fixture: ComponentFixture<RealityCheckInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RealityCheckInfoComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RealityCheckInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
