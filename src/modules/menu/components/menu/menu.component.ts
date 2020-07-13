import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {MenuHelper} from 'wlc-engine/modules/menu/helpers/menu.helper';
import {IMenuItem, IMenuParams} from 'wlc-engine/modules/menu/interfaces/menu.interface';
import {AbstractComponent} from 'wlc-engine/classes/abstract.component';

// import {GlobalHelper} from 'wlc-engine/helpers/global.helper';

@Component({
    selector: '[wlc-menu]',
    // template: GlobalHelper.getTemplates([
    //     require('!raw-loader!./templates/menu.component.html').default,
    //     require('!raw-loader!./templates/sref.template.html').default
    // ]),
    templateUrl: './menu.component.html',
    styleUrls: ['./styles/menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent extends AbstractComponent implements OnInit {
    public items: IMenuItem[];

    constructor(
        @Inject('params') protected params: IMenuParams,
        private cdr: ChangeDetectorRef,
    ) {
        super(params);
    }

    public ngOnInit(): void {
        this.items = MenuHelper.getItems(
            {
                items: this.params.items,
                type: this.params.type
            }
        );
        this.cdr.detectChanges();
    }
}
