import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services';
import {NOTIFICATION_METADATA} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {INotificationMetadata} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {IImage, IMessageData} from './message.interface';
import * as Params from './message.params';

import {
    assign as _assign,
    isArray as _isArray,
    isObject as _isObject,
    values as _values,
} from 'lodash-es';

@Component({
    selector: '[wlc-notification-message]',
    templateUrl: './message.component.html',
    styleUrls: ['./styles/message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent
    extends AbstractComponent
    implements OnInit {

    public $params: Params.IMessageParams;
    public title: string;
    public messages: string[];
    public action: {
        label: string;
        onClick: () => void;
    };
    public image: IImage;
    public icon: string;
    public isHTML: boolean;

    constructor(
        @Inject(NOTIFICATION_METADATA)
        protected meta: INotificationMetadata,
        @Inject('injectParams')
        protected params: IMessageData,
        configService: ConfigService,
    ) {
        super(
            <IMixedParams<Params.IMessageParams>>{
                injectParams: {
                    type: params.type,
                    showCloseButton: params.showCloseButton,
                    imageFit: params.image?.fit,
                },
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        this.params.wlcElement = `${(this.params.wlcElement || 'notification_status-' + this.params.type)}`;
        super.ngOnInit(this.params);

        const {title, message, action, image, displayAsHTML} = this.params;

        _assign(this, {
            title: title || this.$params.defaultTitles[this.$params.type],
            messages: _isArray(message) ? message : _isObject(message) ? _values(message) : [message],
            isHTML: displayAsHTML,
            image,
            icon: this.$params.typeIcons[this.$params.type],
        });

        if (action) {
            this.action = {
                label: action.label,
                onClick: action.onClick === 'dismiss'
                    ? this.meta.dismiss
                    : action.onClick,
            };
        }
    }
}
