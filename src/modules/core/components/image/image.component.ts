import {
    Component,
    OnInit,
    Input,
    ViewEncapsulation,
    OnChanges,
    Inject,
    Optional,
    ChangeDetectionStrategy,
    EventEmitter,
    Output,
} from '@angular/core';

import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers/global.helper';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes';

import * as Params from './image.params';

@Component({
    selector: '[wlc-image]',
    templateUrl: './image.component.html',
    styleUrls: ['./styles/image.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageComponent extends AbstractComponent implements OnInit, OnChanges {
    @Input() public slimSrc: string;
    @Input() public slimSources: Params.ISource[];
    @Input() public src: string;
    @Input() public sources: Params.ISource[];
    @Input() public wlcElement: string;
    @Input() public customMod: string | string[];

    @Input() protected inlineParams: Params.IImageCParams;

    @Output() loadSuccess = new EventEmitter<void>();
    @Output() loadError = new EventEmitter<void>();

    public override $params: Params.IImageCParams;

    constructor(
        @Optional()
        @Inject('injectParams') protected injectParams: Params.IImageCParams,
    ) {
        super({
            injectParams: injectParams || {},
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);

        this.$params.slimSrc = this.slimSrc || this.$params.slimSrc;
        this.$params.slimSources = this.slimSources || this.$params.slimSources;
        this.$params.src = this.src || this.$params.src;
        this.$params.sources = this.sources || this.$params.sources;
        this.$params.wlcElement = this.wlcElement || this.$params.wlcElement;

        this.handleCdnImages();
    }

    public onError(): void {
        this.loadError.emit();
    }

    public onLoad(): void {
        this.loadSuccess.emit();
    }

    protected handleCdnImages(): void {
        if (this.src.indexOf(GlobalHelper.gstaticUrl) >= 0) {
            const imgPath = this.src.replace(GlobalHelper.gstaticUrl, '');

            if (imgPath.indexOf('/games') === 0) {

                if (this.configService.get<boolean>('$base.optimization.slimExtraImages.use')) {
                    this.$params.slimSrc = `${GlobalHelper.gstaticUrl}/slim-extra${imgPath}`;
                    this.$params.slimSources = [
                        {
                            srcset: GlobalHelper.setFileExtension(this.$params.slimSrc, 'webp'),
                            type: 'image/webp',
                        },
                    ];
                }

                if (!this.sources) {
                    this.sources = [
                        {
                            srcset: GlobalHelper.setFileExtension(this.$params.src, 'webp'),
                            type: 'image/webp',
                        },
                    ];
                }
            }
        }
    }
}
