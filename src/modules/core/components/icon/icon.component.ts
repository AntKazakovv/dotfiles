import {Component, OnInit, Input, ViewEncapsulation, ChangeDetectorRef} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {FilesService} from 'wlc-engine/modules/core';
import {IFile} from 'wlc-engine/modules/core/services/files/files.service';
import {AbstractComponent} from 'wlc-engine/classes';
import * as Params from './icon.params';

@Component({
    selector: '[wlc-icon]',
    templateUrl: './icon.component.html',
    styleUrls: ['./styles/icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IconComponent extends AbstractComponent implements OnInit {
    public imageHtml: SafeHtml;
    public imagePath: string;

    @Input() protected iconUrl: string;
    @Input() protected iconName: string;
    constructor(
        protected sanitizer: DomSanitizer,
        protected fileService: FilesService,
        protected cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.getIconHtml();
    }

    protected async getIconHtml() {
        let file: IFile;

        if (this.iconName) {
            file = await this.fileService.getSvgByName(this.iconName);
        } else if (this.iconUrl) {
            file = await this.fileService.getFileByUrl(this.iconUrl);
        }

        if (file.url) {
            this.imagePath = file.url;
        } else if (file.htmlString) {
            this.imageHtml = this.sanitizer.bypassSecurityTrustHtml(file.htmlString);
        }

        this.cdr.markForCheck();
    }
}
