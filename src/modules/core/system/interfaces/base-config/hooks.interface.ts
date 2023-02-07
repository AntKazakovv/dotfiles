import {HookHandler} from 'wlc-engine/modules/core/system/services/hooks/hooks.service';

export interface IHooksConfig {
    handlers?: IHookSettings<unknown>[];
}

export interface IHookSettings<T> {
    name: string,
    handler: HookHandler<T>,
}
