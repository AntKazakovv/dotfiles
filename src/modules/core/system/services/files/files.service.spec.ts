import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {MockService} from 'ng-mocks';

import _keys from 'lodash-es/keys';
import _each from 'lodash-es/each';

import {localFiles} from 'wlc-engine/modules/core/system/config/files.config';
import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {LogService} from 'wlc-engine/modules/core/system/services/log/log.service';
import {FilesService} from './files.service';

describe('FilesService', () => {
    let filesService: FilesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                FilesService,
                {
                    provide: ConfigService,
                    useValue: MockService(ConfigService),
                },
                {
                    provide: LogService,
                    useValue: MockService(LogService),
                },
                {
                    provide: HttpClient,
                    useValue: MockService(HttpClient),
                },
            ],
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
