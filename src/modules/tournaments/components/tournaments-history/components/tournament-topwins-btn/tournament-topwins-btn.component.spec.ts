import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TournamentTopwinsBtnComponent} from './tournament-topwins-btn.component';

describe('TournamentTopwinsBtnComponent', () => {
    let component: TournamentTopwinsBtnComponent;
    let fixture: ComponentFixture<TournamentTopwinsBtnComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentTopwinsBtnComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentTopwinsBtnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
