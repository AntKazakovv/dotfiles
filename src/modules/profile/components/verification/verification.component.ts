import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {
    AbstractComponent,
    ConfigService,
    EventService,
    IMixedParams,
    ISelectCParams,
} from 'wlc-engine/modules/core';
import {
    IDoc,
    IDocTypeResponse,
    DocGroupModel,
    DocModel,
    VerificationService,
    IDroppedFiles,
    LoaderStatus,
    ISelectOptions,
} from 'wlc-engine/modules/profile';
import * as Params from './verification.params';

import {
    map as _map,
    filter as _filter,
    find as _find,
} from 'lodash-es';

@Component({
    selector: '[wlc-verification]',
    templateUrl: './verification.component.html',
    styleUrls: ['./styles/verification.component.scss'],
    preserveWhitespaces: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerificationComponent extends AbstractComponent implements OnInit {
    @ViewChild('inputFile') public inputFile: ElementRef<HTMLInputElement>;
    public docGroups: DocGroupModel[];
    public currentDocGroup: DocGroupModel;
    public loaded: boolean = false;
    public $params: Params.IVerificationCParams;
    public selectParams: ISelectCParams = {
        labelText: gettext('Type document'),
        theme: 'vertical',
        common: {},
        name: undefined,
        items: [],
        control: new FormControl(''),
    };

    private docTypes: IDocTypeResponse[];

    constructor(
        @Inject('injectParams') protected injectParams: Params.IVerificationCParams,
        protected configService: ConfigService,
        protected verificationService: VerificationService,
        protected cdr: ChangeDetectorRef,
        protected eventService: EventService,
    ) {
        super(
            <IMixedParams<Params.IVerificationCParams>>{
                injectParams,
                defaultParams: Params.defaultParams,
            }, configService);
    }

    public get selectItems(): ISelectOptions[] {
        return _map(this.docTypes, ({ID, Name}) => {
            return {
                value: ID,
                title: Name,
            };
        });
    }

    public get isSelectMode(): boolean {
        return this.docTypes.length >= this.$params.selectModeFrom;
    }

    public async ngOnInit(): Promise<void> {
        super.ngOnInit({
            ...this.verificationService.params,
            ...this.injectParams,
        } as Params.IVerificationCParams);
        this.docTypes = await this.verificationService.getDocsTypes();
        if (!this.docTypes.length) {
            this.loaded = true;
            return this.cdr.markForCheck();
        }

        this.eventService.subscribe({
            name: 'DROP_FILES',
        }, (data: IDroppedFiles) => {
            if (data.label === this.currentDocGroup.ID) {
                this.preloadFile(data.files);
            }
        });

        this.selectParams.items = this.selectItems;
        this.selectParams.control.setValue(this.docTypes[0].ID);
        this.selectParams.control.registerOnChange(this.setCurrentDocGroup.bind(this));
        await this.updateDocItems();
        this.currentDocGroup = this.docGroups[0];
        this.loaded = true;
    }

    public async updateDocItems(): Promise<void> {
        const docs: IDoc[] = await this.verificationService.getUserDocs();
        this.docGroups = _map(this.docTypes, (docType: IDocTypeResponse) => {
            const userDocs: IDoc[] = _filter(docs, (userDoc: IDoc) => {
                return docType.TypeKey === userDoc.DocType;
            });
            return new DocGroupModel(docType, _map(userDocs, (doc) => new DocModel(doc)), this.isSelectMode);
        });
        if (this.currentDocGroup) {
            this.setCurrentDocGroup(this.currentDocGroup.ID);
        }
        this.cdr.markForCheck();
    }

    public async preloadFile(files: FileList): Promise<void> {
        if (files[0] && this.verificationService.checkFormat(files[0])) {
            this.currentDocGroup.preview = {
                base64: await this.verificationService.getPreview(files[0]),
                file: files[0],
            };
        }
        this.cdr.markForCheck();
    }

    public async uploadFile(): Promise<void> {
        if (this.currentDocGroup.pending) {
            return;
        }
        this.switchLoader(LoaderStatus.Loading);

        try {
            await this.verificationService.uploadFile(this.currentDocGroup.preview.file, this.currentDocGroup.ID);
            await this.updateDocItems();
        } catch (result) {
            this.verificationService.showError(result.errors[0]);
        } finally {
            this.switchLoader();
            this.clearPreview();
        }
    }

    public clearPreview() {
        this.currentDocGroup.preview = {};
        this.inputFile.nativeElement.value = '';
    }

    public async deleteDoc(doc: DocModel): Promise<void> {
        doc.switchLoader(LoaderStatus.Deleting);
        this.cdr.markForCheck();

        try {
            await this.verificationService.deleteDoc(doc);
            await this.updateDocItems();
        } catch (result) {
            this.verificationService.showError(result.errors[0]);
        }
    }

    protected setCurrentDocGroup(id: string) {
        this.currentDocGroup = _find(this.docGroups, ({ID}) => ID === id);
    }

    protected switchLoader(status: LoaderStatus = LoaderStatus.Ready): void {
        this.currentDocGroup.switchLoader(status);
        this.cdr.markForCheck();
    }

}
