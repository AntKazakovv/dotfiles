import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TournamentPrizesComponent} from './tournament-prizes.component';

describe('TournamentPrizesComponent', () => {
    let component: TournamentPrizesComponent;
    let fixture: ComponentFixture<TournamentPrizesComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentPrizesComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentPrizesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
