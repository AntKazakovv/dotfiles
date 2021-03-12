import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GameDashboardBonusesComponent} from './game-dashboard-bonuses.component';

describe('GameDashboardBonusesComponent', () => {
    let component: GameDashboardBonusesComponent;
    let fixture: ComponentFixture<GameDashboardBonusesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GameDashboardBonusesComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameDashboardBonusesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
