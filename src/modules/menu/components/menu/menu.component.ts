import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, Injector, OnInit} from '@angular/core';
import {log} from 'util';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';
import {IMenuItem, IMenuParams} from 'wlc-engine/modules/menu/components/menu/menu.interface';
import {MenuHelper} from 'wlc-engine/modules/menu/helpers/menu.helper';
import {defaultParams} from './menu.params';
import {LanguageSelectorComponent} from 'wlc-engine/modules/base/components/language-selector/language-selector.component';
import {LayoutService} from 'wlc-engine/modules/core/services/layout/layout.service';

import {
    cloneDeep as _cloneDeep,
    get as _get,
} from 'lodash';

@Component({
    selector: '[wlc-menu]',
    templateUrl: './menu.component.html',
    styleUrls: ['./styles/menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent extends AbstractComponent implements OnInit {
    public items: IMenuItem[];
    public $params: IMenuParams;

    constructor(
        @Inject('injectParams') protected params: IMenuParams,
        protected cdr: ChangeDetectorRef,
        protected injector: Injector,
        protected layoutService: LayoutService,
    ) {
        super({injectParams: params, defaultParams});
    }

    public ngOnInit(): void {
        super.ngOnInit();
        this.items = MenuHelper.getItems(
            {
                items: this.params.items,
                type: this.params.type,
            },
        );
        this.cdr.markForCheck();
    }

    public get useLanguageSelector(): boolean {
        return this.hasParam('common.languageSelector');
    }

    public get LanguageSelectorParams(): any {
        return _get(this.$params, 'common.languageSelector.params', {});
    }
}
