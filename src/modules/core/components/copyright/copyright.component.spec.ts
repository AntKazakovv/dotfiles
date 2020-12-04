import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {CopyrightComponent} from 'wlc-engine/modules/core/components/copyright/copyright.component';

describe('CopyrightComponent', () => {
    let component: CopyrightComponent;
    let fixture: ComponentFixture<CopyrightComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ CopyrightComponent ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CopyrightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
