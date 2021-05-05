import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {DashboardLoyaltyBlockComponent} from './dashboard-loyalty-block.component';

describe('DashboardLoyaltyBlockComponent', () => {
    let component: DashboardLoyaltyBlockComponent;
    let fixture: ComponentFixture<DashboardLoyaltyBlockComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DashboardLoyaltyBlockComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DashboardLoyaltyBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
