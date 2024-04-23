import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    Inject,
    Input,
    ViewEncapsulation,
    SimpleChanges,
    OnChanges,
    ChangeDetectorRef,
    NgZone,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    LogService,
} from 'wlc-engine/modules/core';
import {FilesService} from 'wlc-engine/modules/core/system/services/files/files.service';
import {IFile} from 'wlc-engine/modules/core/system/services/files/files.service';
import {IconModel} from 'wlc-engine/modules/icon-list/system/models/icon-list-item.model';

import * as Params from './icon-list-item.params';

@Component({
    selector: '[wlc-icon-list-item]',
    templateUrl: './icon-list-item.component.html',
    styleUrls: ['./styles/icon-list-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
})

export class IconListItemComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() protected inlineParams: Params.IIconListItemCParams;
    @Input() protected logImageErrorChild: Params.TIconErrorCode;
    @Input() public icon: IconModel;
    @Input() public infoText: string;

    public override $params: Params.IIconListItemCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IIconListItemCParams,
        configService: ConfigService,
        cdr: ChangeDetectorRef,
        protected logService: LogService,
        protected fileService: FilesService,
        protected ngZone: NgZone,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
    }

    public override async ngOnInit(): Promise<void> {
        super.ngOnInit(this.inlineParams);
        if (!this.icon) {
            this.ngZone.runOutsideAngular(async () => {
                if (
                    this.$params.icon.showAs === 'img'
                    && this.$params.icon.image.includes('//agstatic.com/')
                ) {
                    this.$params.icon.image = await this.getIconPath();
                }
                this.icon = this.$params.icon;
                this.cdr.markForCheck();
            });
        }
    }

    public override ngOnChanges(changes: SimpleChanges): void {
        if (changes['icon']) {
            this.icon.isError = false;
        }
    }

    public errorHandler(): void {
        this.icon.isError = true;
        this.logService.sendLog({
            code: (this.logImageErrorChild !== true) ? this.logImageErrorChild : '1.4.0',
            flog: {
                iconName: this.icon.data.alt,
                iconUrl: this.icon.data.iconUrl,
            },
        });
    }

    protected async getIconPath(): Promise<string> {
        const localPath = this.$params.icon.image.replace('//agstatic.com/', '/');
        const file: IFile = await this.fileService.getFile(localPath);

        if (file.url) {
            return file.url;
        }

        return this.$params.icon.image;
    }
}
