import {IComponentParams} from 'wlc-engine/interfaces/config.interface';

export interface IPostComponentParams extends IComponentParams<string, string> {
    slug: string;
}
