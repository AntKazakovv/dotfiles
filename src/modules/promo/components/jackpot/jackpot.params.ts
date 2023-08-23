import {
    CustomType,
    IComponentParams,
} from 'wlc-engine/modules/core/system/interfaces/config.interface';
import {JackpotModel} from 'wlc-engine/modules/games/system/models/jackpot.model';

export type JackpotType = 'default' | CustomType;
export type JackpotTheme = '1' | 'vertical' | CustomType;

export interface IJackpotCParams extends IComponentParams<JackpotTheme, JackpotType, string> {
    data: JackpotModel;
};

export const defaultParams: Partial<IJackpotCParams> = {
    class: 'wlc-jackpot',
};
