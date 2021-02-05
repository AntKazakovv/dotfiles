import {Directive, HostListener, Input} from '@angular/core';
import {EventService} from 'wlc-engine/modules/core';

@Directive({
    selector: '[wlc-dnd]',
})
export class DrugNDropDirective {
    @Input('dnd-data-label') label: string
    constructor(
        protected eventService: EventService,
    ) {
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('dragovered');
    }

    @HostListener('dragleave', ['$event'])
    public onDrugLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragovered');
    }

    @HostListener('drop', ['$event'])
    public onDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('dragovered');
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
