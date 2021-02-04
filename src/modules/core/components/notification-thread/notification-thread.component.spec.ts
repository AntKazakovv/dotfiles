import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationThreadComponent } from './notification-thread.component';

describe('NotificationsComponent', () => {
    let component: NotificationThreadComponent;
    let fixture: ComponentFixture<NotificationThreadComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ NotificationThreadComponent ]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NotificationThreadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
