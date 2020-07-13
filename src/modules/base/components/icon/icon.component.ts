import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {DefaultSvgIcons} from 'wlc-engine/svg/default-icons';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

import {
    get as _get
} from 'lodash';

@Component({
    selector: '[wlc-icon]',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class IconComponent implements OnInit {

    @Input() protected iconName: string;

    public iconHtml: SafeHtml;

    constructor(
        protected sanitizer: DomSanitizer
    ) {
    }

    ngOnInit(): void {
        this.getIconHtml();
    }

    protected getIconHtml() {
        this.iconHtml = this.sanitizer.bypassSecurityTrustHtml(_get(DefaultSvgIcons, this.iconName));
    }

}
