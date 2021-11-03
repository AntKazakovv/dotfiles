import {TestBed} from '@angular/core/testing';

import {ConfigService} from 'wlc-engine/modules/core/system/services/config/config.service';
import {InjectionService} from 'wlc-engine/modules/core/system/services';
import {ButtonComponent} from 'wlc-engine/modules/core/components/button/button.component';

describe('InjectionService', () => {
    let injectionService: InjectionService;
    let configServiceSpy: jasmine.SpyObj<ConfigService>;

    const loadedModuleName: string = 'core';
    const loadedComponentName: string = 'wlc-button';
    const pathToExistingComponent: string = `${loadedModuleName}.${loadedComponentName}`;

    const noLoadedModuleName: string = 'bonuses';
    const noLoadedComponentName: string = 'wlc-bonuses-list';
    const noLoadedServiceName: string = 'bonuses-service';
    const pathToNonExistingComponent: string = `${noLoadedModuleName}.${noLoadedComponentName}`;
    const noLoadedModules: string[] = [noLoadedModuleName];

    const nonExistingComponentName: string = 'component_name_that_no_exists';

    beforeEach(async () => {
        configServiceSpy = jasmine.createSpyObj(
            'ConfigService',
            ['set'],
            {
                load: Promise.resolve(),
            },
        );

        TestBed.configureTestingModule({
            providers: [
                InjectionService,
                {
                    provide: ConfigService,
                    useValue: configServiceSpy,
                },
            ],
        });
        injectionService = TestBed.inject(InjectionService);

        await injectionService.importModules([loadedModuleName]);
    });

    it('-> should be created', () => {
        expect(injectionService).toBeDefined();
    });

    it('-> getComponent should return component by name, do nothing if it not exists', () => {
        expect(injectionService.getComponent(pathToExistingComponent)).toEqual(ButtonComponent);
        expect(injectionService.getComponent(`${loadedModuleName}.${nonExistingComponentName}`)).toBeUndefined();
    });

    it('-> loadComponent should call getComponent if module is loaded and not call importModules', async () => {
        const injectionServiceGetComponentSpy = spyOn(injectionService, 'getComponent');
        const injectionServiceImportModulesSpy = spyOn(injectionService, 'importModules');
        await injectionService.loadComponent(pathToExistingComponent);

        expect(injectionServiceGetComponentSpy).toHaveBeenCalledWith(pathToExistingComponent);
        expect(injectionServiceImportModulesSpy).not.toHaveBeenCalled();
    });

    it('-> loadComponent should call importModules if module is not loaded', async () => {
        const injectionServiceGetComponentSpy = spyOn(injectionService, 'getComponent');
        const injectionServiceImportModulesSpy = spyOn(injectionService, 'importModules');
        await injectionService.loadComponent(pathToNonExistingComponent);

        expect(injectionServiceImportModulesSpy).toHaveBeenCalledWith([noLoadedModuleName]);
        expect(injectionServiceGetComponentSpy).toHaveBeenCalledWith(pathToNonExistingComponent);
    });

    it('-> getService should call importModule if module is not loaded', async () => {
        injectionService['importModule'] = jasmine.createSpy('importModule', injectionService['importModule']);
        await injectionService.getService(`${noLoadedModuleName}.${noLoadedServiceName}`);

        expect(injectionService['importModule']).toHaveBeenCalledWith(noLoadedModuleName);
    });

    it('-> importModules should call importModule for each no loaded module', async () => {
        injectionService['importModule'] = jasmine.createSpy('importModule', injectionService['importModule']);
        await injectionService.importModules(noLoadedModules);

        noLoadedModules.forEach((module: string) => {
            expect(injectionService['importModule']).toHaveBeenCalledWith(module);
        });
    });

    it('-> importModules should add modules and components to class field', async () => {
        await injectionService.importModules(noLoadedModules);

        noLoadedModules.forEach((module: string) => {
            expect(injectionService['loadedModules'][module]).toBeDefined();
            expect(injectionService['components'][module]).toBeDefined();
        });
    });

    it('-> importModules should not call importModule for loaded modules', async () => {
        const loadedModules: string[] = [loadedModuleName];
        injectionService['importModule'] = jasmine.createSpy('importModule', injectionService['importModule']);
        await injectionService.importModules(loadedModules);

        loadedModules.forEach(() => {
            expect(injectionService['importModule']).not.toHaveBeenCalled();
        });
    });
});
