import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef,
    ElementRef,
    OnChanges,
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
} from '@angular/platform-browser';

import {
    FilesService,
    IFile,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './icon.params';

@Component({
    selector: '[wlc-icon]',
    templateUrl: './icon.component.html',
    styleUrls: ['./styles/icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IconComponent extends AbstractComponent implements OnInit, OnChanges {
    public imageHtml: SafeHtml;
    public imagePath: string;
    public ready: boolean;

    @Input() protected iconUrl: string;
    @Input() protected iconName: string;
    @Input() protected fallback: string;
    constructor(
        protected sanitizer: DomSanitizer,
        protected fileService: FilesService,
        protected elRef: ElementRef,
        protected cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams: {},
            defaultParams: Params.defaultParams,
        });
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.getIconHtml();
        this.ready = true;
    }

    public ngOnChanges(): void {
        if (this.ready) {
            this.getIconHtml();
        }
    }

    protected async getIconHtml() {
        let file: IFile;

        if (this.iconName) {
            file = this.fileService.getSvgByName(this.iconName);
        } else if (this.iconUrl) {
            file = await this.fileService.getFileByUrl(this.iconUrl);
        }

        if (file.htmlString) {
            this.imageHtml = this.sanitizer.bypassSecurityTrustHtml(file.htmlString);
        } else if (file.url) {
            this.imagePath = file.url;
        } else {
            this.elRef.nativeElement.remove();
        }

        this.cdr.markForCheck();
    }
}
