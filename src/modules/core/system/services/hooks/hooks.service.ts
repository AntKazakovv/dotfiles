import {Injectable} from '@angular/core';
import {
    IIndexing,
} from 'wlc-engine/modules/core';

import _bind from 'lodash-es/bind';
import _forEach from 'lodash-es/forEach';

export type HookHandler<T> = (data: T) => T | Promise<T>;

export interface IHookHandlerDescriptor {
    handlerIndex: number;
    name: string;
}

@Injectable({
    providedIn: 'root',
})
export class HooksService {

    protected hooks: IIndexing<HookHandler<unknown>[]> = {};

    /**
     * @param {string} name Name of hook
     * @param {function} handler Handler for hook with current name
     * @param {object} context Context of hook handler
     * @example
     * <pre>
     *     HookService.set('launchInfo@GamesPlayComponentController', (launchInfo) => {
     *           launchInfo.html = '<p></p>';
     *           return launchInfo;
     *       }, this);
     * </pre>
     * @description
     *
     * Save handler for hook with current name
     */
    public set<T>(name: string, handler: HookHandler<T>, context: unknown = {}): IHookHandlerDescriptor {
        if (!this.hooks[name]) {
            this.hooks[name] = [];
        }
        this.hooks[name].push(_bind(handler, context));
        return {
            handlerIndex: this.hooks[name].length - 1,
            name: name,
        };
    }

    /**
     * @param {string} name Name of hook
     * @param {any} data Data for handle
     * @example
     * <pre>
     *     HookService.run('launchInfo@GamesPlayComponentController', launchInfo)
     * </pre>
     * @description
     *
     * Run handlers of hook with current name
     *
     * @returns {any} Handled data
     */
    public async run<T>(name: string, data: T): Promise<T> {
        const handlers = (this.hooks[name] || []) as HookHandler<T>[];
        for (let i = 0; i < handlers.length; i++) {
            data = await handlers[i](data);
        }
        return data;
    }

    /**
     * Clear hooks by descriptors
     *
     * @param {IHookHandlerDescriptor[]} descriptors
     */
    public clear(descriptors: IHookHandlerDescriptor[]): void {
        _forEach(descriptors, (descriptor: IHookHandlerDescriptor) => {
            const handlers = this.hooks[descriptor.name];
            if (handlers) {
                handlers.splice(descriptor.handlerIndex, 1);
            }
        });
    }
}
