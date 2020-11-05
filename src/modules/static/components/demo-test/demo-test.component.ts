import {Component, ChangeDetectorRef} from '@angular/core';

import {
    ModalService,
    IModalParams,
} from 'wlc-engine/modules/base/services';
import {FaqComponent} from './../faq/faq.component';

@Component({
    selector: 'wlc-demo-test',
    templateUrl: './demo-test.component.html',
    styleUrls: ['./demo-test.component.scss']
})
export class demoTestComponent {

    public isLoading: boolean = false;
    public isLoading2: boolean = false;

    constructor(
        protected changeDetector: ChangeDetectorRef,
        protected ModalService: ModalService,
    ) {}

    load(): void {
        this.isLoading = true;

        setTimeout(() => {
            this.isLoading = false;
            this.changeDetector.detectChanges();
        }, 3000)
    }

    load2(): void {
        this.isLoading2 = true;

        setTimeout(() => {
            this.isLoading2 = false;
            this.changeDetector.detectChanges();
        }, 3000)
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

}
