import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import {EventService} from 'wlc-engine/modules/core/services';

import {
    ModalService,
    IModalParams,
} from 'wlc-engine/modules/base/services';
import {FaqComponent} from './../faq/faq.component';
import {IWinnerData, WinnersService} from 'wlc-engine/modules/promo/services';

@Component({
    selector: 'wlc-demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss']
})
export class demoTestComponent implements OnInit {

    public isLoading: boolean = false;
    public isLoading2: boolean = false;

    constructor(
        protected changeDetector: ChangeDetectorRef,
        protected eventService: EventService,
        protected ModalService: ModalService,
        protected winnersService: WinnersService,
    ) {}

    ngOnInit(): void {
        this.winnersService.latestWins.subscribe(() => {
            console.log(this.winnersService.latestWinsData);
        });
    }

    load(): void {
        this.isLoading = true;

        setTimeout(() => {
            this.isLoading = false;
            this.changeDetector.detectChanges();
        }, 3000);
    }

    load2(): void {
        this.isLoading2 = true;

        setTimeout(() => {
            this.isLoading2 = false;
            this.changeDetector.detectChanges();
        }, 3000);
    }

    openLeftPanel(): void {
        this.eventService.emit({
            name: 'PANEL_OPEN',
            data: 'left',
        });
    }
    openRightPanel(): void {
        this.eventService.emit({
            name: 'PANEL_OPEN',
            data: 'right'
        });
    }

    openModal(): void {
        this.ModalService.showModal('baseInfo');
    }

    openModalFaq(): void {
        const modalParams: IModalParams = {
            id: 'faq',
            modalTitle: 'FAQ',
            component: FaqComponent,
            onModalShow: () => {console.log('foo');}
        };

        this.ModalService.showModal(modalParams);
    }

    openModalSearch(): void {
        this.ModalService.showModal('search');
    }

}
