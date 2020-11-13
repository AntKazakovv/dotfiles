import {HammerGestureConfig} from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

import {IIndexing} from 'wlc-engine/interfaces';

export class HammerConfig extends HammerGestureConfig {
    public overrides = <IIndexing<Object>>{
        swipe: {
            direction: Hammer.DIRECTION_ALL,
        },
    };
}
