import {Component, OnInit, Input, Inject} from '@angular/core';

@Component({
    selector: '[wlc-main-menu]',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements OnInit {

    constructor(@Inject('params') public params: any) {
    }

    ngOnInit(): void {
    }
}
