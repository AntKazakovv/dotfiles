import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    ChangeDetectorRef,
    ElementRef,
    OnChanges,
    Output,
    EventEmitter,
    Inject,
    Optional,
} from '@angular/core';
import {
    DomSanitizer,
    SafeHtml,
} from '@angular/platform-browser';

import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import {FilesService} from 'wlc-engine/modules/core/system/services/files/files.service';
import {IFile} from 'wlc-engine/modules/core/system/services/files/files.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './icon.params';

import _keys from 'lodash-es/keys';
import _isNil from 'lodash-es/isNil';

// TODO:REFACTOR:change-detection-rule
// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
    selector: '[wlc-icon]',
    templateUrl: './icon.component.html',
    styleUrls: ['./styles/icon.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class IconComponent extends AbstractComponent implements OnInit, OnChanges {
    public override $params: Params.IIconCParams;
    public imageHtml: SafeHtml;
    public imagePath: string;
    public ready: boolean;

    /** if true, svg will be shown as image
     **/
    @Input() public showSvgAsImg: boolean = false;
    @Input() public wlcElement: string;
    @Input() public fallback: string;
    @Input() protected iconUrl: string;
    @Input() protected iconName: string;
    @Input() protected iconPath: string;

    @Output() imageError = new EventEmitter<void>();

    constructor(
        @Optional()
        @Inject('injectParams') protected injectParams: Params.IIconCParams,
        protected sanitizer: DomSanitizer,
        protected fileService: FilesService,
        protected elRef: ElementRef,
        cdr: ChangeDetectorRef,
    ) {
        super({
            injectParams: injectParams || {},
            defaultParams: Params.defaultParams,
        }, null, cdr);
    }

    public override ngOnInit(): void {
        if (this.injectParams && _isNil(this.iconPath) && _isNil(this.iconName) && _isNil(this.iconUrl)) {
            this.iconPath = this.injectParams.iconPath;
            this.iconName = this.injectParams.iconName;
            this.iconUrl = this.injectParams.iconUrl;
        }
        super.ngOnInit(this.prepareParams());
        this.getIconHtml();
        this.ready = true;
    }

    public override ngOnChanges(): void {
        if (this.ready) {
            this.imageHtml = null;
            this.imagePath = null;
            this.getIconHtml();
        }
    }

    public imageErrorHolder(): void {
        this.imageError.emit();
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
                this.imageErrorHolder();
            }
        } else {
            file = {
                key: undefined,
            };
        }

        if (file?.htmlString && !this.showSvgAsImg) {
            this.imageHtml = this.sanitizer.bypassSecurityTrustHtml(this.fileService.replaceSvgId(file.htmlString));
            this.addModifiers(['loaded', 'svg']);
        } else if (file?.url) {
            this.imagePath = file.url;
            this.addModifiers(['loaded', 'img']);
        } else {
            this.imageErrorHolder();
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
