import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LinkBlockComponent} from './link-block.component';

describe('LinkBlockComponent', () => {
    let component: LinkBlockComponent;
    let fixture: ComponentFixture<LinkBlockComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LinkBlockComponent],
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LinkBlockComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
