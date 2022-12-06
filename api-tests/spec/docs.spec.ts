import fs from 'fs';
import path from 'path';

import FormData from 'form-data';

import {
    checkIfSuccess,
    TLoginResponse,
    fetch,
    getRequestUrl,
    logout,
    login,
    printWarn,
} from './helpers/global';

import {
    IDocType,
    IUserDoc,
} from 'wlc-engine/modules/profile/system/interfaces/verification.interface';
import {IData} from 'wlc-engine/modules/core';
import {IIndexing} from 'wlc-engine/modules/core';

describe('/api/v1/docs/', () => {
    const docsID: IUserDoc['ID'][] = [];
    const docsInterface = 'IUserDoc';
    const docsTypes: IDocType['TypeKey'][] = [];
    const docsUrl = '/api/v1/docs/';
    const maxRequestRetry = 2;
    let docsExtensions: string[] = [];
    let headers: TLoginResponse;
    let skipTests = false;

    beforeAll(async (): Promise<void> => {
        headers = await login();

        /* get docsTypes */
        await fetch(getRequestUrl(docsUrl + 'types'), {headers})
            .then((res: Response) => res.json())
            .then((response: IData<IDocType[]>) => {
                checkIfSuccess(response);
                response.data?.forEach((element: IDocType): void => {
                    docsTypes.push(element.TypeKey);
                });
            });

        /* get docsExtensions */
        await fetch(getRequestUrl(docsUrl + 'extensions'), {headers})
            .then((res: Response) => res.json())
            .then((response: IData<IIndexing<string>>) => {
                checkIfSuccess(response);
                if (response.data) {
                    docsExtensions = Object.values(response.data);
                };
            });

        /* get docsID */
        await getDocsID();

        skipTests = !docsTypes.length || !docsExtensions.length;
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL * maxRequestRetry);

    const getDocsID = async (): Promise<void> => {
        await fetch(getRequestUrl(docsUrl), {headers})
            .then((res: Response) => res.json())
            .then((response: IData<IUserDoc[]>) => {
                checkIfSuccess(response);
                response.data?.forEach((element: IUserDoc): void => {
                    docsID.push(element.ID);
                });
            });
    };

    afterAll(async (): Promise<void> => {
        await logout();
    });

    it('-> IDocType', async (): Promise<void> => {
        const docsTypesInterface = 'IDocType';

        await fetch(getRequestUrl(docsUrl + 'types'), {headers})
            .then((res: Response) => res.json())
            .then((response: IData<IDocType[]>) => {
                checkIfSuccess(response);
                if (response.data?.length) {
                    response.data.forEach((element: IDocType): void => {
                        expect(docsTypesInterface).toBeImplemented(element);
                    });
                } else {
                    printWarn('Docs types list is empty');
                }
            })
            .catch(fail);
    });

    it('-> Extensions', async (): Promise<void> => {
        await fetch(getRequestUrl(docsUrl + 'extensions'), {headers})
            .then((res: Response) => res.json())
            .then((response: IData<IIndexing<string>>) => {
                checkIfSuccess(response);

                if (response.data) {
                    Object.values(response.data).forEach(value => {
                        expect(typeof value).toEqual('string');
                    });
                } else {
                    printWarn('Docs extensions list is empty');
                }
            })
            .catch(fail);
    });

    it('-> SendDoc', async (): Promise<void> => {
        if (skipTests) {
            printWarn('Test skipped');
            return;
        }

        await sendDocFile()
            .then((res: Response) => res.json())
            .then((response: IData) => {
                checkIfSuccess(response);
                expect(response.data).toEqual('Success upload');
            })
            .catch(fail);
    });

    it('-> IUserDoc', async (): Promise<void> => {
        for (let retry = maxRequestRetry; retry > 0; retry--) {
            try {
                await fetch(getRequestUrl(docsUrl), {headers})
                    .then((res: Response) => res.json())
                    .then((response: IData<IUserDoc[]>) => {
                        checkIfSuccess(response);
                        if (response.data?.length) {
                            response.data.forEach((element: IUserDoc): void => {
                                expect(docsInterface).toBeImplemented(element);
                            });
                            retry = 0;
                        } else {
                            throw Error('Docs list is empty');
                        }
                    });
            } catch (error) {
                if (retry === 1) {
                    printWarn((error as Error).message + ' and cant add docs.');
                    return;
                }
                if (!skipTests) {
                    await sendDocFile().catch(fail);
                }
            }
        }
    }, jasmine.DEFAULT_TIMEOUT_INTERVAL * maxRequestRetry);

    it('-> IUserDoc/{id}', async (): Promise<void> => {
        if (skipTests || !docsID.length) {
            printWarn('Test skipped');
            return;
        }

        docsID.forEach(element => {
            const docRequest = getRequestUrl(docsUrl + element);
            fetch(docRequest, {headers})
                .then((res: Response) => res.json())
                .then((response: IData<IUserDoc>) => {
                    checkIfSuccess(response);
                    expect(docsInterface).toBeImplemented(response.data);
                })
                .catch(fail);
        });
    });

    it('-> Delete Document', async (): Promise<void> => {
        if (skipTests) {
            printWarn('Test skipped');
            return;
        }

        await sendDocFile().catch(fail);
        await getDocsID().catch(fail);

        const fileToDelete = Math.max(...docsID);

        await fetch(getRequestUrl(docsUrl + fileToDelete), {
            headers,
            method: 'DELETE',
        })
            .then((res: Response) => res.json())
            .then((response: IData) => {
                checkIfSuccess(response);
                expect(response.data['ID']).toEqual(String(fileToDelete));
            })
            .catch(fail);
    });

    const sendDocFile = async () => {
        const docsSendFileFormData = new FormData();
        const docsSendFileUrl = getRequestUrl(docsUrl + 'send-file');
        const docsSendFilePath = path.resolve(__dirname, './assets/images/doc.jpg');
        docsSendFileFormData.append('file1', fs.createReadStream(docsSendFilePath));
        docsSendFileFormData.append('Description', docsTypes[0]);
        docsSendFileFormData.append('DocType', docsTypes[0]);

        return fetch(docsSendFileUrl,
            {
                headers,
                method: 'POST',
                body: docsSendFileFormData,
            });
    };
});
