import {CustomType} from 'wlc-engine/modules/core/system/classes/abstract.component';

export type TAnimationType = 'pulse' | CustomType;

export type TAnimateButtonHandler = 'deposit' | 'click';

export type TAnimateButtonHandlerOnService = Exclude<TAnimateButtonHandler, 'click'>;

export type TIsFirstAnimateButtonEventByType = {
    [Key in TAnimateButtonHandlerOnService]: boolean;
}
