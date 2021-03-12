import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TournamentThumbComponent} from './tournament-thumb.component';

describe('TournamentThumbComponent', () => {
    let component: TournamentThumbComponent;
    let fixture: ComponentFixture<TournamentThumbComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentThumbComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentThumbComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
