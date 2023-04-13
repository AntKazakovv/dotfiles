import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    Injector,
    Input,
    OnInit,
} from '@angular/core';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services/injection/injection.service';
import {ModalService} from 'wlc-engine/modules/core/system/services/modal/modal.service';
import {AbstractComponent} from 'wlc-engine/modules/core/system/classes/abstract.component';
import {ITab} from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.params';

import * as Params from 'wlc-engine/modules/core/components/tab-switcher/tab-switcher.params';

import _values from 'lodash-es/values';
import _each from 'lodash-es/each';

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
        cdr: ChangeDetectorRef,
        protected modalService: ModalService,
        configService: ConfigService,
    ) {
        super({
            injectParams,
            defaultParams: Params.defaultParams,
        }, configService, cdr);
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
        // this.tabs.find(tab => tab.active === true).active = false;
        // selectedTab.active = true;

        //TODO пофиксить временно решение для переключения модалок, что бы отображался нужный заголовок
        if (this.modalService.getActiveModal(selectedTab.modalId)?.id === selectedTab.modalId) return;

        this.modalService.showModal(selectedTab.modalId);
    }

    protected applyConfig(): void {
        _each(this.tabs, async tab => {
            if (tab.component) {
                tab.componentClass = await this.injectionService.loadComponent(tab.component);
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
                        useValue: tab.componentParams,
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
