import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TournamentConditionComponent} from './tournament-condition.component';

describe('TournamentConditionComponent', () => {
    let component: TournamentConditionComponent;
    let fixture: ComponentFixture<TournamentConditionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentConditionComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentConditionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
