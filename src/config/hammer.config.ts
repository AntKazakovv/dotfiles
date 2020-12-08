import {HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from '@egjs/hammerjs';
import {Injectable} from '@angular/core';
import {IIndexing} from 'wlc-engine/interfaces';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
    constructor() {
        super();
        (globalThis as any).Hammer = Hammer.default;
    }
    public overrides = <IIndexing<Object>>{
        swipe: {
            direction: Hammer.DIRECTION_ALL,
        },
    };
}
