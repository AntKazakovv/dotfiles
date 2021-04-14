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

import _includes from 'lodash-es/includes';
import _find from 'lodash-es/find';

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

        try {
            const result = await this.dataService.request<IData>('docs/send-file', formData);
            this.showSuccess(gettext('Document uploaded successfully'));

            return result;
        } catch (result) {
            this.showError(result.errors);
            return Promise.reject(result);
        }
    }

    public async deleteDoc(doc: DocModel): Promise<IData> {
        try {
            const result = await this.dataService.request<IData>({
                name: 'docs-delete',
                url: `/docs/${doc.ID}`,
                type: 'DELETE',
                system: 'docs',
            });
            this.showSuccess(gettext('Document deleted successfully'));

            return result;
        } catch (result) {
            this.showError(result.errors);
            return Promise.reject(result);
        }

    }

    public showError(message: string | string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'error',
                title: gettext('Verification Error'),
                message,
            },
        });
    }

    public showSuccess(message: string | string[]): void {
        this.eventService.emit({
            name: NotificationEvents.PushMessage,
            data: {
                type: 'success',
                title: gettext('Verification'),
                message,
            },
        });
    }

    public checkFormat(file: File): boolean {
        if (file.size > this.params.maxSize * 1000000) {
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
            reader.onload = function (evt) {
                done(evt.target.result as string);
            };
            reader.readAsDataURL(file);
        });
    }

    public checkUploadLimit(docsCount: number): boolean {
        if (docsCount >= this.params.maxDocsCount) {
            this.eventService.emit({
                name: NotificationEvents.PushMessage,
                data: {
                    type: 'error',
                    title: gettext('Error'),
                    message: gettext('You cannot upload more documents of this type'),
                },
            });
        }

        return docsCount >= this.params.maxDocsCount;
    }


    private init() {
        this.dataService.registerMethod({
            name: 'docs-types',
            url: '/docs/types',
            // TODO return cache
            //cache: 60 * 1000 * 10, // 10 min
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
