import {IComponentParams} from 'wlc-engine/modules/core/system/interfaces/config.interface';

export interface IPostComponentParams extends IComponentParams<string, string, string> {
    slug: string;
    setTitle?: (title: string) => {},
}
