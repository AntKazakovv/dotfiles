import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {WlcModalComponent} from 'wlc-engine/modules/core/components/modal';

describe('WlcModalComponent', () => {
    let component: WlcModalComponent;
    let fixture: ComponentFixture<WlcModalComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [WlcModalComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WlcModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
