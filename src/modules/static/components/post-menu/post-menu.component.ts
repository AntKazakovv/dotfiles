import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {defaultParams, IPostMenuComponentParams} from './post-menu.params';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';

import {
    get as _get,
} from 'lodash';

export * from './post-menu.params';

@Component({
    selector: '[wlc-post-menu]',
    templateUrl: './post-menu.component.html',
    styleUrls: ['./styles/post-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostMenuComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public menuItems: TextDataModel[];
    public title: string;

    public $params: IPostMenuComponentParams;

    constructor(
        protected staticService: StaticService,
        @Inject('injectParams') protected injectParams: IPostMenuComponentParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams, defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            await this.fetchPosts();
        } catch (e) {
            console.log(e);
        }

        this.isReady = true;
        this.prepareParams();
        this.cdr.markForCheck();
    }

    protected async fetchPosts(): Promise<void> {
        this.menuItems = await this.staticService.getPostsListByCategorySlug(this.$params.common.categorySlug);
    }

    protected prepareParams(): void {
        this.title = _get(this.$params, 'common.title');
    }
}
