import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HaveAccountComponent} from './have-account.component';

describe('HaveAccountComponent', () => {
    let component: HaveAccountComponent;
    let fixture: ComponentFixture<HaveAccountComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [HaveAccountComponent],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HaveAccountComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
