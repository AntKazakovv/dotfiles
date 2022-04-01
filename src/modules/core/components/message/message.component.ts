import {
    ChangeDetectionStrategy,
    Component,
    HostBinding,
    Inject,
    OnInit,
} from '@angular/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {NOTIFICATION_METADATA} from 'wlc-engine/modules/core/system/services/notification/notification.service';
import {INotificationMetadata} from 'wlc-engine/modules/core/system/services/notification/notification.interface';
import {
    IImage,
    IMessageData,
} from './message.interface';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces/global.interface';
import * as Params from './message.params';

import _assign from 'lodash-es/assign';
import _isArray from 'lodash-es/isArray';
import _isObject from 'lodash-es/isObject';
import _values from 'lodash-es/values';

@Component({
    selector: '[wlc-notification-message]',
    templateUrl: './message.component.html',
    styleUrls: ['./styles/message.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent
    extends AbstractComponent
    implements OnInit {

    @HostBinding('class.wlc-notification-message--modal')
    public isModal: boolean = this.meta.isModal;

    @HostBinding('class.wlc-notification-message--popup')
    public isPopup: boolean = !this.meta.isModal;

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
    public messageContext: IIndexing<string | number>;

    constructor(
        @Inject(NOTIFICATION_METADATA)
        public meta: INotificationMetadata,
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
        if (this.params.messageContext) {
            this.messageContext = this.params.messageContext;
        }
        super.ngOnInit(this.params);

        const {title, message, action, image, displayAsHTML} = this.params;

        _assign(this, {
            title: title || this.$params.defaultTitles[this.$params.type],
            messages: this.prepareMessages(message),
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

    protected prepareMessages(messages: string | string[] | object): string[] {
        let msgs: string[];

        if (_isArray(messages)) {
            msgs = messages;
        } else if (_isObject(messages)) {
            msgs = _values(messages);
        } else if (messages) {
            msgs = [messages];
        } else {
            msgs = [];
        }

        return msgs;
    }
}
