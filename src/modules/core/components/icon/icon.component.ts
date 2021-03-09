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
    IIndexing,
} from 'wlc-engine/modules/core';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './icon.params';

import {
    keys as _keys,
} from 'lodash-es';

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

    @Input() public wlcElement: string;
    @Input() public fallback: string;
    @Input() protected iconUrl: string;
    @Input() protected iconName: string;
    @Input() protected iconPath: string;

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
        super.ngOnInit(this.prepareParams());
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
        } else if (this.iconPath) {
            file = await this.fileService.getFile(this.iconPath);

            if (!file?.htmlString && !file?.url && this.fallback) {
                file = await this.fileService.getFile(this.fallback);
            }
        }

        if (file?.htmlString) {
            this.imageHtml = this.sanitizer.bypassSecurityTrustHtml(file.htmlString);
            this.addModifiers('loaded');
        } else if (file?.url) {
            this.imagePath = file.url;
            this.addModifiers('loaded');
        } else {
            this.elRef.nativeElement.remove();
        }
        this.cdr.markForCheck();
    }

    protected prepareParams(): any {
        const inlineParams: IIndexing<string> = {};
        inlineParams.wlcElement = this.wlcElement;

        return _keys(inlineParams).length ? inlineParams : null;
    }
}
