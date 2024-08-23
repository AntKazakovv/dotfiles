import {
    ChangeDetectorRef,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    Inject,
    Input,
} from '@angular/core';

import {
    AbstractComponent,
    ConfigService,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';

import {IYoutubeVideoModel} from 'wlc-engine/modules/youtube-block/system/models/youtube-block.model';

import * as Params from './thumb-item.params';

@Component({
    selector: '[wlc-thumb-item]',
    templateUrl: './thumb-item.component.html',
    styleUrls: ['./styles/thumb-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThumbItemComponent extends AbstractComponent implements OnInit {
    @Input() public inlineParams: Params.IThumbItemCParams;

    public override $params: Params.IThumbItemCParams;
    public video: IYoutubeVideoModel;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IThumbItemCParams,
        cdr: ChangeDetectorRef,
        configService: ConfigService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.IThumbItemCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService, cdr);
    }

    public override ngOnInit(): void {
        super.ngOnInit(this.inlineParams);
        this.video = this.$params.video;
        this.cdr.markForCheck();
    }

    public openVideo(): void {
        this.$params.events$.next({name: 'thumbClick', data: this.video});
    }
}
