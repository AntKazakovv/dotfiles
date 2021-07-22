import {Subject} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {
    HookHandler,
    HooksService,
    IHookHandlerDescriptor,
} from 'wlc-engine/modules/core';

export interface IAbstractHookParams {
    hooksService: HooksService,
    disableHooks?: Subject<void>
}

export class AbstractHook {

    protected hookDescriptors: IHookHandlerDescriptor[] = [];

    constructor(
        protected params: IAbstractHookParams,
    ) {
        if (this.params.disableHooks) {
            this.params.disableHooks.pipe(finalize(() => this.onDisableHooks()));
        }
    }

    public setHook<T>(id: string, handler: HookHandler<T>, context: unknown): void {
        this.hookDescriptors.push(this.params.hooksService.set<T>(id, handler, context));
    }

    protected onDisableHooks(): void {
        this.params.hooksService.clear(this.hookDescriptors);
    }
}
