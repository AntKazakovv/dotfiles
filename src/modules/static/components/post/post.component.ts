import {Component, Inject, OnInit, Input} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService} from 'wlc-engine/modules/static';
import {IPostComponentParams} from 'wlc-engine/modules/static/components/post/post.interface';
import {TextDataModel} from 'wlc-engine/modules/static';

@Component({
    selector: '[wlc-post]',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent extends AbstractComponent implements OnInit {
    @Input() protected slug: string;
    public data: TextDataModel;

    public html = '<div wlc-logo>111</div>';

    constructor(
        protected staticService: StaticService,
        @Inject('params') protected params: IPostComponentParams,
    ) {
        super(params);
    }

    async ngOnInit(): Promise<void> {
        try {
            this.data = await this.staticService.getPost(this.slug || this.params.slug);
        } catch (e) {
        }
        console.log(this.data);
    }

}
