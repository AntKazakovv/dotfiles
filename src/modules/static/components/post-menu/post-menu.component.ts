import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {defaultParams, IPostMenuCParams} from './post-menu.params';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {StaticService, TextDataModel} from 'wlc-engine/modules/static';

import {
    get as _get,
} from 'lodash-es';

export * from './post-menu.params';

@Component({
    selector: '[wlc-post-menu]',
    templateUrl: './post-menu.component.html',
    styleUrls: ['./styles/post-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PostMenuComponent extends AbstractComponent implements OnInit {
    public isReady: boolean = false;
    public menuItems: TextDataModel[] = [];
    public title: string;
    public type = 'sref';
    public basePath: string;

    public $params: IPostMenuCParams;

    constructor(
        protected staticService: StaticService,
        @Inject('injectParams') protected injectParams: IPostMenuCParams,
        protected cdr: ChangeDetectorRef,
        private translate: TranslateService,
    ) {
        super({injectParams, defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        try {
            await this.fetchPosts();
        } catch (e) {
            console.error(e);
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

        if (this.$params.common.basePath?.url) {
            this.type = 'href';
            this.setBasePath();
        }
    }

    private setBasePath(): void {

        this.basePath = this.$params.common.basePath?.url;

        if (this.basePath[this.basePath.length - 1] !== '/') {
            this.basePath += '/';
        }

        if (this.$params.common.basePath.addLanguage) {
            this.basePath += this.translate.currentLang + '/';
        }

        if (this.$params.common.basePath.page) {
            this.basePath += this.$params.common.basePath.page + '/';
        }
    }
}
