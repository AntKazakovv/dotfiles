import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

import {
    AbstractComponent,
    ConfigService,
} from 'wlc-engine/modules/core';
import {
    StaticService,
    TextDataModel,
} from 'wlc-engine/modules/static';

import * as Params from './post-menu.params';

import _get from 'lodash-es/get';
import _sortBy from 'lodash-es/sortBy';
import _includes from 'lodash-es/includes';
import _merge from 'lodash-es/merge';

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

    public $params: Params.IPostMenuCParams;

    constructor(
        protected staticService: StaticService,
        @Inject('injectParams') protected injectParams: Params.IPostMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        private translate: TranslateService,
    ) {
        super({injectParams, defaultParams: Params.defaultParams});
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit();

        if (this.configService.get('$base.app.type') === 'aff') {
            const basePath: Params.IBasePath = {
                url: this.configService.get<string>('$base.affiliate.siteUrl'),
                addLanguage: true,
            };
            _merge(this.$params.common, {basePath});
        }

        const list = await this.staticService.getPostsListByCategorySlug(this.$params.common.categorySlug);
        this.menuItems = _sortBy(list, (item) => item.sortOrder);

        this.isReady = true;
        this.prepareParams();
        this.cdr.markForCheck();
    }

    public getFullOuterLink({outerLink}: TextDataModel): string {
        return _includes(outerLink, '//') ? outerLink : '//' + outerLink;
    }

    protected prepareParams(): void {
        this.title = _get(this.$params, 'common.title');

        if (this.$params.common.basePath?.url) {
            this.type = 'href';
            this.setBasePath();
        }
    }

    protected setBasePath(): void {
        this.basePath = this.$params.common.basePath?.url;

        if (!this.basePath.endsWith('/')) {
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
