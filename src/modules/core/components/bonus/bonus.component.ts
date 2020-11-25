import {Component, HostBinding, Input, OnInit} from '@angular/core';

@Component({
    selector: '[wlc-bonus]',
    templateUrl: './bonus.component.html',
    styleUrls: ['./bonus.component.scss'],
})
export class BonusComponent implements OnInit {
    @Input() public bonus: any;
    @Input() public size: string = '';

    @HostBinding('class')
    protected get classes(): string {
        return this.size
            ? `wlc-bonus wlc-bonus--${this.bonus.type} wlc-bonus--${this.size}`
            : `wlc-bonus wlc-bonus--${this.bonus.type}`;
    }

    constructor() {
    }

    ngOnInit(): void {
    }

}
