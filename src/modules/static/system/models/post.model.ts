import dayjs from 'dayjs';
import type {Dayjs} from 'dayjs';
import {IAcf, IPostResponse} from 'wlc-engine/modules/static/system/interfaces/static.interface';

export class PostModel {
    public readonly slug: string;
    public readonly categories: number[];
    public readonly content: string;
    public readonly date: Dayjs;
    public readonly title: string;
    public readonly image: string;
    public readonly description: string;
    public readonly acf: IAcf;

    constructor(post: IPostResponse) {
        this.slug = post.slug;
        this.categories = post.categories;
        this.content = post.content?.rendered;
        this.date = dayjs(post.date, 'YYYY-MM-DDTHH:mm:ss');
        this.title = post.title?.rendered;
        this.image = post.image;
        this.description = post.excerpt?.rendered;
        this.acf = post?.acf;
    }

    public getIntroText(limit = 120): string {
        return this.description.substr(0, limit) + ((this.description.length > limit) ? '...' : '');
    }
}
