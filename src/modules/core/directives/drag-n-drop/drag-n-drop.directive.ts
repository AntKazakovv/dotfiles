import {Directive, HostListener, Input} from '@angular/core';
import {EventService} from 'wlc-engine/modules/core';

@Directive({
    selector: '[wlc-dnd]',
})
export class DragNDropDirective {
    @Input('dnd-data-label') label: string;

    constructor(
        protected eventService: EventService,
    ) {
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation();
        (e.currentTarget as Element).classList.add('dragovered');
    }

    @HostListener('dragleave', ['$event'])
    public onDrugLeave(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation();
        (e.currentTarget as Element).classList.remove('dragovered');
    }

    @HostListener('drop', ['$event'])
    public onDrop(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation();
        (e.currentTarget as Element).classList.remove('dragovered');
        const files: FileList = e.dataTransfer.files;
        if (files.length) {
            this.eventService.emit({
                name: 'DROP_FILES',
                data: {
                    label: this.label,
                    files,
                },
            });
        }
    }
}
