import {AbstractHook} from 'wlc-engine/modules/core/system/classes';
import {GlobalHelper} from 'wlc-engine/modules/core/system/helpers';
import {
    ConfigService,
    EventService,
    HooksService,
} from 'wlc-engine/modules/core/system/services';
import {
    IHookShowModal,
    modalServiceHooks,
} from '../modal.service';

export interface IMobileAppHooksParams {
    hooksService: HooksService;
    configService: ConfigService;
    eventService: EventService,
}

export class MobileAppHooks extends AbstractHook {

    constructor (
        protected override params: IMobileAppHooksParams,
    ) {
        super({
            hooksService: params.hooksService,
        });
        this.init();
    }

    protected init(): void {
        if (!GlobalHelper.isMobileApp()) {
            return;
        }
        this.setHook<IHookShowModal>(modalServiceHooks.showModal, this.showModalHook, this);
    }

    protected showModalHook(data: IHookShowModal): IHookShowModal {
        return data;
    }
}
