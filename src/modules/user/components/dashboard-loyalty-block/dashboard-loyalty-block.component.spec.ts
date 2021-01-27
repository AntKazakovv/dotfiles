import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {LoyaltyBlockComponent} from './dashboard-loyalty-block.component';

describe('LoyaltyBlockComponent', () => {
    let component: LoyaltyBlockComponent;
    let fixture: ComponentFixture<LoyaltyBlockComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ LoyaltyBlockComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoyaltyBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
