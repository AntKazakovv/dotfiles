import {DragNDropDirective} from './drag-n-drop.directive';
import {EventService} from 'wlc-engine/modules/core';

describe('DndDirective', () => {
    it('should create an instance', () => {
        const directive = new DragNDropDirective(new EventService());
        expect(directive).toBeTruthy();
    });
});
