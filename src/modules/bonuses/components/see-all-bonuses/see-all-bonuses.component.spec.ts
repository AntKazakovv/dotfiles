import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SeeAllBonusesComponent} from './see-all-bonuses.component';

describe('SeeAllBonusesComponent', () => {
    let component: SeeAllBonusesComponent;
    let fixture: ComponentFixture<SeeAllBonusesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SeeAllBonusesComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SeeAllBonusesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
