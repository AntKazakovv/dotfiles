import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WlcPaginationComponent } from './pagination.component';

describe('CounterComponent', () => {
    let component: WlcPaginationComponent;
    let fixture: ComponentFixture<WlcPaginationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ WlcPaginationComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WlcPaginationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
