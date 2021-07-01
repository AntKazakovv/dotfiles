import {
    ComponentFixture,
    TestBed,
} from '@angular/core/testing';

import {
    LivechatButtonComponent,
} from './livechat-button.component';

describe('LivechatButtonComponent', () => {
    let component: LivechatButtonComponent;
    let fixture: ComponentFixture <LivechatButtonComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LivechatButtonComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LivechatButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
