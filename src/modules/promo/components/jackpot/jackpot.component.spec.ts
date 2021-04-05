import {waitForAsync, ComponentFixture, TestBed} from '@angular/core/testing';

import {JackpotComponent} from './jackpot.component';

describe('JackpotComponent', () => {
    let component: JackpotComponent;
    let fixture: ComponentFixture<JackpotComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ JackpotComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(JackpotComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
