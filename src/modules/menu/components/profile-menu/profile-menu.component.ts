import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    Inject,
} from '@angular/core';
import {StateService} from '@uirouter/core';

import {AbstractComponent, IMixedParams} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ConfigService} from 'wlc-engine/modules/core';
import {ProfileMenuService} from 'wlc-engine/modules/menu/system/services';
import * as MenuParams from 'wlc-engine/modules/menu/components/menu/menu.params';
import * as Params from './profile-menu.params';

import {
    forEach as _forEach,
    clone as _clone,
    find as _find,
} from 'lodash';

@Component({
    selector: '[wlc-profile-menu]',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./styles/profile-menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileMenuComponent extends AbstractComponent implements OnInit {
    public $params: Params.IProfileMenuCParams;
    public menuParams: MenuParams.IMenuCParams;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IProfileMenuCParams,
        protected cdr: ChangeDetectorRef,
        protected configService: ConfigService,
        protected stateSerivce: StateService,
        protected profileMenuService: ProfileMenuService,
    ) {
        super(
            <IMixedParams<Params.IProfileMenuCParams>>{
                injectParams: injectParams,
                defaultParams: Params.defaultParams,
            },
            configService,
        );
    }

    public ngOnInit(): void {
        super.ngOnInit();

        this.menuParams = {
            type: 'profile-menu',
        };
        switch (this.$params.type) {
            case 'tabs':
                this.menuParams.items = this.profileMenuService.getTabsMenu();
                break;
            case 'submenu':
                this.menuParams.items = this.profileMenuService.getSubMenu();
                break;
            case 'dropdown':
                this.menuParams.items = this.profileMenuService.getDropdownMenu();
                break;
        }
        this.menuParams = _clone(this.menuParams);
        this.cdr.markForCheck();
    }
}
