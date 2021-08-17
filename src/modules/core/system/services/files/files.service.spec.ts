import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AppModule} from 'wlc-engine/modules/app/app.module';
import {localFiles} from 'wlc-engine/modules/core/system/config/files.config';
import {FilesService} from './files.service';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';

describe('FilesService', () => {
    let filesService: FilesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppModule, HttpClientTestingModule],
            providers: [FilesService],
        });

        filesService = TestBed.inject(FilesService);
    });

    it('-> should be created', () => {
        expect(filesService).toBeTruthy();
    });

    it('-> getFile: check the getFile method', () => {

        const testData = [
            'test123',
            '123.png',
            undefined,
            null,
            '',
        ];

        _each(testData, async (file: string) => {
            expect(await filesService.getFile(file)).toEqual(jasmine.objectContaining({
                key: file,
            }));
        });

        _each(_keys(localFiles), async (file: string) => {
            const content = await filesService.getFile(file);

            expect(content).toEqual(jasmine.objectContaining({
                key: file,
                location: 'local-engine',
            }));

            expect(typeof content.htmlString).toEqual('string');
        });
    });

    it('-> getFileByUrl: check the getFileByUrl method', async () => {

        const gstaticData = [
            '/wlc/icons/european/v1/lobby.svg',
            '/wlc/icons/european/v1/last.svg',
            '/wlc/icons/european/v1/favorites.svg',
            '/favorites.svg',
            '/',
        ];

        _each(gstaticData, async (file: string) => {
            expect(await filesService.getFileByUrl(file)).toEqual(jasmine.objectContaining({
                key: file,
                location: 'gstatic',
                url: `/gstatic${file}`,
            }));
        });
    });


    it('-> getSvgByName: check the getSvgByName method', async () => {
        _each(_keys(localFiles), async (file: string) => {
            const content = await filesService.getSvgByName(file);

            expect(content).toEqual(jasmine.objectContaining({
                key: file,
                location: 'local-engine',
            }));

            expect(typeof content.htmlString).toEqual('string');
        });
    });
});
