import {Component, HostBinding, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
    selector: '[wlc-close]',
    templateUrl: './close.component.html',
    styleUrls: ['./styles/close.component.scss'],
})
export class CloseComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-close';

    @Output() close: EventEmitter<void> = new EventEmitter<void>();

    ngOnInit(): void {
    }

    public onClick(): void {
        this.close.emit();
    }

}
