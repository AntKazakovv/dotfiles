import {Injectable} from '@angular/core';
import {DataService, IData} from 'wlc-engine/modules/core';
import {
    IDoc,
    IDocTypeResponse,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';

@Injectable({
    providedIn: 'root',
})
export class VerificationService {
    constructor(
        private dataService: DataService,
    ) {
        this.init();
    }

    public async getDocsTypes(): Promise<IDocTypeResponse[]> {
        return (await this.dataService.request<IData>('docs/docs-types'))?.data;
    }

    public async getUserDocs(): Promise<IDoc[]> {
        return (await this.dataService.request<IData>('docs/docs-list'))?.data;
    }

    public async uploadDoc(file: File, docLabel: string): Promise<boolean> {
        const formData = new FormData();
        formData.append('file1', file);
        formData.append('Description', docLabel);
        formData.append('DocType', docLabel);
        const result = await this.dataService.request<IData>('docs/send-file', formData);
        return result.status === 'success';
    }

    public async deleteDoc(docId: number): Promise<boolean> {
        const result = await this.dataService.request<IData>({
            name: 'docs-delete',
            url: `/docs/${docId}`,
            type: 'DELETE',
            system: 'docs',
            events: {
                fail: 'DELETE_DOC_ERROR',
            },
        });
        return result.status === 'success';
    }

    private init() {
        this.dataService.registerMethod({
            name: 'docs-types',
            url: '/docs/types',
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
            events: {
                fail: 'SEND_FILE_ERROR',
            },
        });

    }
}
