import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TotalJackpotComponent} from './total-jackpot.component';

describe('TotalJackpotComponent', () => {
    let component: TotalJackpotComponent;
    let fixture: ComponentFixture<TotalJackpotComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ TotalJackpotComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TotalJackpotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
