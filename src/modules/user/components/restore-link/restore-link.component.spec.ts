import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RestoreLinkComponent } from 'wlc-engine/modules/user/components/restore-link/restore-link.component';

describe('RestoreLinkComponent', () => {
    let component: RestoreLinkComponent;
    let fixture: ComponentFixture<RestoreLinkComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ RestoreLinkComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RestoreLinkComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
