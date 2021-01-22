import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {UserStatsComponent} from 'wlc-engine/modules/user/components/user-stats/user-stats.component';

describe('UserStatsComponent', () => {
    let component: UserNameComponent;
    let fixture: ComponentFixture<UserNameComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ UserNameComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(UserNameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
