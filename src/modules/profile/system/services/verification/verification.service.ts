import {Injectable} from '@angular/core';
import {
    DataService,
    EventService,
    IData,
    NotificationEvents,
} from 'wlc-engine/modules/core';
import {
    DocModel,
    IDoc,
    IDocTypeResponse,
} from 'wlc-engine/modules/profile';
import {find as _find, includes as _includes} from 'lodash-es';

@Injectable({
    providedIn: 'root',
})
export class VerificationService {
    public params = {
        maxSize: 4,
        fileTypes: ['jpg', 'png', 'jpeg'],
        maxDocsCount: 5,
    }

    constructor(
        private dataService: DataService,
        private eventService: EventService,
    ) {
        this.init();
    }

    public async getDocsTypes(): Promise<IDocTypeResponse[]> {
        return (await this.dataService.request<IData>('docs/docs-types'))?.data;
    }

    public async getUserDocs(): Promise<IDoc[]> {
        return (await this.dataService.request<IData>('docs/docs-list'))?.data;
    }

    public async uploadFile(file: File, docLabel: string): Promise<IData> {
        const formData = new FormData();
        formData.append('file1', file);
        formData.append('Description', docLabel);
        formData.append('DocType', docLabel);
        return await this.dataService.request<IData>('docs/send-file', formData);
    }

    public async deleteDoc(doc: DocModel): Promise<IData> {
        return  await this.dataService.request<IData>({
            name: 'docs-delete',
            url: `/docs/${doc.ID}`,
            type: 'DELETE',
            system: 'docs',
        });
    }

    public showError(modalMessage: string): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'error',
                title: gettext('Verification Error'),
                message: modalMessage,
            },
        });
    }

    public checkFormat(file: File): boolean {
        if(file.size > this.params.maxSize * 1000000) {
            this.showError('No valid size');
            return false;
        }

        const isValidType = !!_find(this.params.fileTypes, (item) => {
            return _includes(file.type, item);
        });

        if (!isValidType) {
            this.showError('No valid format');
            return false;
        }

        return true;
    }

    public async getPreview(file: File): Promise<string> {
        const reader = new FileReader();
        return new Promise((done) => {
            reader.onload = function(evt) {
                done(evt.target.result as string);
            };
            reader.readAsDataURL(file);
        });
    }

    private init() {
        this.dataService.registerMethod({
            name: 'docs-types',
            url: '/docs/types',
            cache: 60 * 1000 * 120,
            type: 'GET',
            system: 'docs',
        });

        this.dataService.registerMethod({
            name: 'docs-list',
            url: '/docs',
            type: 'GET',
            system: 'docs',
        });

        this.dataService.registerMethod({
            name: 'send-file',
            url: '/docs',
            type: 'POST',
            system: 'docs',
        });

    }
}
