import {Component, OnInit, HostBinding, Input} from '@angular/core';

@Component({
    selector: '[wlc-have-account]',
    templateUrl: './have-account.component.html',
    styleUrls: ['./have-account.component.scss'],
})
export class HaveAccountComponent implements OnInit {
    @HostBinding('class') protected class = 'wlc-have-account';
    @Input() linkText: string = 'Login now'

    constructor() {
    }

    ngOnInit(): void {
    }

}
