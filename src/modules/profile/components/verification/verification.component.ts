import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Inject,
    OnInit,
} from '@angular/core';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    IData,
    IMixedParams,
    ModalService,
} from 'wlc-engine/modules/core';
import {VerificationService} from 'wlc-engine/modules/profile/system/services/verification/verification.service';
import * as Params from './verification.params';
import {
    IDoc,
    IDocItem,
    IDocTypeResponse,
    IDroppedFiles, LoaderType,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

import {
    map as _map,
    forEach as _forEach,
    kebabCase as _kebabCase,
    filter as _filter,
} from 'lodash-es';

@Component({
    selector: '[wlc-verification]',
    templateUrl: './verification.component.html',
    styleUrls: ['./styles/verification.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationComponent extends AbstractComponent implements OnInit {
    public docItems: IDocItem[];
    public $params: Params.IVerificationCParams;

    public ready: boolean = false;

    constructor(
        @Inject('injectParams') protected injectParams: Params.IVerificationCParams,
        protected configService: ConfigService,
        protected verificationService: VerificationService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
        protected modalService: ModalService,
    ) {
        super(
            <IMixedParams<Params.IVerificationCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    async ngOnInit(): Promise<void> {
        super.ngOnInit();

        this.eventService.subscribe({
            name: 'DROP_FILES',
        }, (data: IDroppedFiles) => {
            if (this.ready) {
                this.fileUpload(data.files, data.label);
            }
        });

        this.eventService.subscribe([
            {name: 'DELETE_DOC_ERROR'},
            {name: 'SEND_FILE_ERROR'},
        ], (res: IData) => {
            this.showError(res.errors[0]);
            this.ready = true;
        });

        const docTypes: IDocTypeResponse[] = await this.verificationService.getDocsTypes();
        await this.updateDocItems(docTypes);
        this.ready = true;
    }

    public async fileUpload(files: FileList, docLabel: string): Promise<void> {
        this.ready = false;
        this.setLoader(docLabel, 'loading');
        const result = await this.verificationService.uploadDoc(files[0], docLabel);
        if (result) {
            await this.updateDocItems();
        }
        this.setLoader(docLabel);
        this.ready = true;
    }

    public async deleteFile(docId: number, docLabel: string): Promise<void> {
        this.ready = false;
        this.setLoader(docLabel, 'deleting');
        const result = await this.verificationService.deleteDoc(docId);
        if (result) {
            await this.updateDocItems();
        }
        this.setLoader(docLabel);
        this.ready = true;
    }

    public toKebabCase(string: string): string {
        return _kebabCase(string);
    }

    protected setLoader(docLabel: string, status: LoaderType = false) {
        _forEach(this.docItems, (item: IDocItem) => {
            if (item.ID === docLabel) {
                item.loading = status;
            }
        });
        this.cdr.markForCheck();
    }

    protected async updateDocItems(docTypes?: IDocTypeResponse[]): Promise<void> {
        const docs: IDoc[] = await this.verificationService.getUserDocs();

        this.docItems = _map(docTypes || this.docItems, (docType: IDocTypeResponse) => {
            const userDocs: IDoc[] = _filter(docs, (userDoc: IDoc) => {
                return docType.ID === userDoc.DocType;
            });

            return {
                ...docType,
                docs: userDocs || [],
            };
        });

        this.cdr.markForCheck();
    }

    protected showError(modalMessage: string): void {
        this.modalService.showError({
            modalMessage,
            textAlign: 'center',
            size: 'sm',
            showFooter: false,
        });
    }
}
