import { takeUntil } from 'rxjs/operators';
import { Component, ChangeDetectorRef, OnInit, OnDestroy, Input, Inject } from '@angular/core';
import {EventService} from 'wlc-engine/modules/core/services';

import {
    ModalService,
} from 'wlc-engine/modules/core/services';
import {FaqComponent} from './../faq/faq.component';
import {WinnersService} from 'wlc-engine/modules/promo/services';
import {WinnerModel} from 'wlc-engine/modules/promo/models/winner.model';
import {Subject} from 'rxjs';

@Component({
    selector: '[wlc-demo-test]',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss'],
})
export class demoTestComponent implements OnInit, OnDestroy {

    public isLoading: boolean = false;
    public isLoading2: boolean = false;

    public winners: WinnerModel[];

    public $destroy: Subject<void> = new Subject<void>();


    constructor(
        @Inject('injectParams') protected params: any,
        protected changeDetector: ChangeDetectorRef,
        protected eventService: EventService,
        protected ModalService: ModalService,
        protected winnersService: WinnersService,
    ) {}

    async ngOnInit(): Promise<void> {

        // if (this.params.number) {
        this.winnersService.latestWinsObserver
            .pipe(takeUntil(this.$destroy))
            .subscribe((data) => {
                console.log('blah', data);
            });
        // }

    }

    ngOnDestroy(): void {
        this.$destroy.next();
        this.$destroy.complete();
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
            data: 'right',
        });
    }

    openModal(): void {
        this.ModalService.showModal('baseInfo');
    }

    openModalFaq(): void {
        const modalParams = {
            id: 'faq',
            modalTitle: 'FAQ',
            component: FaqComponent,
            onModalShow: () => {console.log('foo');},
        };

        this.ModalService.showModal(modalParams);
    }

    openModalSearch(): void {
        this.ModalService.showModal('search');
    }

    openModalDemoTest(): void {
        this.ModalService.showModal({
            id: 'demo-test',
            component: demoTestComponent,
            componentParams: {
                number: 1,
            },
        });
    }

}
