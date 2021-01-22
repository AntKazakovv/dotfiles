import {ComponentFixture, TestBed} from '@angular/core/testing';

import {EnterPromocodeComponent} from './enter-promocode.component';

describe('EnterPromocodeComponent', () => {
    let component: EnterPromocodeComponent;
    let fixture: ComponentFixture<EnterPromocodeComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EnterPromocodeComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(EnterPromocodeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
