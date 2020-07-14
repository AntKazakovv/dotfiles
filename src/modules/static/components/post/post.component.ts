import {Component, Inject, OnInit} from '@angular/core';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService} from 'wlc-engine/modules/static';
import {IPostComponentParams} from 'wlc-engine/modules/static/components/post/post.interface';

@Component({
    selector: '[wlc-post]',
    templateUrl: './post.component.html',
    styleUrls: ['./post.component.scss']
})
export class PostComponent extends AbstractComponent implements OnInit {

    public html = '<div wlc-logo>111</div>';

    constructor(
        protected staticService: StaticService,
        @Inject('params') protected params: IPostComponentParams,
    ) {
        super(params);
    }

    ngOnInit(): void {
        this.staticService.getStaticData({});
    }

}
