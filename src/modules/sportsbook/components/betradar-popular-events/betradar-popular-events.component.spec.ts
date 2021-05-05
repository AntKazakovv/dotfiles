import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BetradarPopularEventsComponent} from './betradar-popular-events.component';

describe('BetradarPopularEventsComponent', () => {
    let component: BetradarPopularEventsComponent;
    let fixture: ComponentFixture<BetradarPopularEventsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BetradarPopularEventsComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BetradarPopularEventsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
