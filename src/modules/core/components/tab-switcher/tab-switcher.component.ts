import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Injector,
    Input,
    OnInit,
} from '@angular/core';

import _values from 'lodash-es/values';
import _each from 'lodash-es/each';

import {ComponentHelper} from 'wlc-engine/modules/core/system/helpers/component.helper';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITab} from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.params';

import * as Params from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.params';

@Component({
    selector: '[wlc-tab-switcher]',
    templateUrl: './tab-switcher.component.html',
    styleUrls: ['./styles/tab-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabSwitcherComponent
    extends AbstractComponent
    implements OnInit {

    @Input() public inlineParams: Params.ITabSwitcherParams;
    @Input() public theme: Params.ComponentTheme;
    @Input() public themeMod: Params.ThemeMod;
    public override $params: Params.ITabSwitcherParams;
    public activeTab: Params.ITab;
    public component: unknown;

    constructor(
        @Inject('injectParams') protected injectParams: Params.ITabSwitcherParams,
        protected injector: Injector,
        protected injectionService: InjectionService,
        protected modalService: ModalService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        });
    }

    public override ngOnInit(): void {
        this.setThemeMod();
        super.ngOnInit();
        this.applyConfig();
        this.tabs[0].active = true;
    }

    public get tabs(): ITab[] {
        if (this.$params?.tabs) {
            return _values(this.$params.tabs);
        }
    }

    public selectTab(selectedTab: Params.ITab): void {
        this.tabs.find(tab => tab.active === true).active = false;
        selectedTab.active = true;
    }

    protected applyConfig(): void {
        _each(this.tabs, async tab => {
            if (tab.component) {
                tab.componentClass = await this.injectionService
                    .loadComponent(ComponentHelper.getComponent(tab.component));

                this.cdr.markForCheck();
            }

            if (tab.startTab) {
                this.tabs[0].active = false;
                tab.active = true;
            }

            if (!tab.injector) {
                tab.injector = Injector.create({
                    providers: [{
                        provide: 'injectParams',
                        useValue: ComponentHelper.getComponentParams(tab.component, tab.componentParams),
                    }],

                    parent: this.injector,
                });
            }
        });
    }

    protected setThemeMod(): void {
        if (this.configService.get<boolean>('$base.registration.skipBonusStep')) {
            this.themeMod = this.configService.get<boolean>('$base.registration.usePromoBanner')
                ? 'with-promo' : 'skip-bonus';
        } else {
            this.themeMod = this.configService.get<string>('$base.profile.type') === 'first' ? 'first' : this.themeMod;
        }
    }
}
