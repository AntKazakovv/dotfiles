import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TournamentPromoComponent} from './tournament-promo.component';

describe('TournamentPromoComponent', () => {
    let component: TournamentPromoComponent;
    let fixture: ComponentFixture<TournamentPromoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentPromoComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentPromoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
