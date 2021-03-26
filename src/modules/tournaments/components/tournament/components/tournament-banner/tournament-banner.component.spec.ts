import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {TournamentBannerComponent} from './tournament-banner.component';

describe('TournamentItemComponent', () => {
    let component: TournamentBannerComponent;
    let fixture: ComponentFixture<TournamentBannerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TournamentBannerComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TournamentBannerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
