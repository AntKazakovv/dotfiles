import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {defaultParams, IPostMenuComponentParams} from './post-menu.params';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';

@Component({
    selector: '[wlc-post-menu]',
    templateUrl: './post-menu.component.html',
    styleUrls: ['./post-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostMenuComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public menuItems: TextDataModel[];

    constructor(
        protected staticService: StaticService,
        @Inject('injectParams') protected params: IPostMenuComponentParams,
        protected cdr: ChangeDetectorRef,
    ) {
        super({injectParams: params, defaultParams});
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            await this.fetchPosts();
        } catch (e) {
            console.log(e);
        }

        this.isReady = true;
        this.cdr.markForCheck();
    }

    protected async fetchPosts(): Promise<void> {
        this.menuItems = await this.staticService.getPostsListByCategorySlug(this.params.categorySlug);
    }

}
