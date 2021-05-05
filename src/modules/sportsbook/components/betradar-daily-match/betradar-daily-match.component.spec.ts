import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BetradarDailyMatchComponent} from './betradar-daily-match.component';

describe('BetradarDailyMatchComponent', () => {
    let component: BetradarDailyMatchComponent;
    let fixture: ComponentFixture<BetradarDailyMatchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BetradarDailyMatchComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BetradarDailyMatchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
