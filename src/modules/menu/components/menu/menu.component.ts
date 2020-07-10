import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MenuHelper} from 'wlc-engine/modules/menu/helpers/menu.helper';
import {IMenuItem, IMenuParams} from 'wlc-engine/modules/menu/interfaces/menu.interface';

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
export class MenuComponent implements OnInit {
    public items: IMenuItem[];

    constructor(
        @Inject('params') protected params: IMenuParams,
        private cdr: ChangeDetectorRef,
    ) {
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
