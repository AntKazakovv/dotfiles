import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {BonusesListComponent} from './bonuses-list.component';

describe('BonusesListComponentt', () => {
    let component: BonusesListComponent;
    let fixture: ComponentFixture<BonusesListComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BonusesListComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BonusesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
