import {DateTime} from 'luxon';
import {IAcf, IPostResponse} from 'wlc-engine/modules/static/interfaces/static.interface';

export class PostModel {
    public readonly slug: string;
    public readonly categories: number[];
    public readonly content: string;
    public readonly date: moment.Moment;
    public readonly title: string;
    public readonly image: string;
    public readonly description: string;
    public readonly acf: IAcf;

    constructor(post: IPostResponse) {
        this.slug = post.slug;
        this.categories = post.categories;
        this.content = post.content?.rendered;
        this.date = DateTime.fromISO(post.date);
        this.title = post.title?.rendered;
        this.image = post.image;
        this.description = post.excerpt?.rendered;
        this.acf = post?.acf;
    }

    public getIntroText(limit = 120) {
        return this.description.substr(0, limit) + ((this.description.length > limit) ? '...' : '');
    }
}
