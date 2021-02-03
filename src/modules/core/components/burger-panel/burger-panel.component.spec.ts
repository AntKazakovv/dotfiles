import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgerPanelComponent } from './burger-panel.component';

describe('BurgerPanelComponent', () => {
    let component: BurgerPanelComponent;
    let fixture: ComponentFixture<BurgerPanelComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ BurgerPanelComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BurgerPanelComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
