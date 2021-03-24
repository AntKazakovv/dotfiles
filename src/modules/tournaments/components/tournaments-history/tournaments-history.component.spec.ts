import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TournamentsHistoryComponent} from './tournaments-history.component';

describe('TournamentsHistoryComponent', () => {
    let component: TournamentsHistoryComponent;
    let fixture: ComponentFixture<TournamentsHistoryComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentsHistoryComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentsHistoryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
