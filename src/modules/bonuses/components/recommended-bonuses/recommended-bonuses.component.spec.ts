import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RecommendedBonusesComponent} from './recommended-bonuses.component';

describe('RecommendedBonusesComponent', () => {
    let component: RecommendedBonusesComponent;
    let fixture: ComponentFixture<RecommendedBonusesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [RecommendedBonusesComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(RecommendedBonusesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
