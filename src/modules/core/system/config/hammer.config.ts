import {HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from '@egjs/hammerjs';
import {Injectable} from '@angular/core';
import {IIndexing} from 'wlc-engine/modules/core/system/interfaces';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
    constructor(protected window: Window) {
        super();
        this.window['Hammer'] = Hammer.default;
    }

    public override overrides = <IIndexing<Object>>{
        swipe: {
            direction: Hammer.DIRECTION_ALL,
        },
    };
}
