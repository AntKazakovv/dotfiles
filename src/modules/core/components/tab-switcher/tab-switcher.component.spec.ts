import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabSwitcherComponent} from './tab-switcher.component';

describe('TabSwitcherComponent', () => {
    let component: TabSwitcherComponent;
    let fixture: ComponentFixture<TabSwitcherComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TabSwitcherComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TabSwitcherComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
