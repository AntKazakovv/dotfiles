(() => {
    'use strict';

    const cookie = window.WlcCookie;

    //TODO rewrite to ts and refactor #219820
    // Start helpers
    function sendLog(code: any, data: any) {
        if (!window.WlcFlog || !window.WlcFlog.enabled) {
            return;
        }
        window.WlcFlog.log(code, data).finally();
    }

    function getQueryString(querystrings?: string) {
        let url = querystrings || window.affiliate || location.search;
        let qs: any = url.substring(url.indexOf('?') + 1).split('&');
        let result: any = {};
        for (let i = 0; i < qs.length; i++) {
            qs[i] = qs[i].split('=');
            result[qs[i][0]] = decodeURIComponent(qs[i][1]);
        }
        return result;
    }

    // End helpers

    let qs: any = getQueryString();

    let affSystem: any = '';
    let affId: any = '';
    let affData: any = location.search;
    let affParams: any = encodeURIComponent(location.search.substr(1));
    let bodyElem: any = document.getElementsByTagName('body');
    let affMaxAge: any = bodyElem.length ? bodyElem[0].getAttribute('data-affiliate-maxage') || 7 : 7;
    let affTrack: any = bodyElem.length ? bodyElem[0].getAttribute('data-affiliate-track') !== 'false' : true;
    let affCookieName: any = '_aff';
    let affCookieData: any = '';

    // Checking for affiliates
    if (qs.uid && qs.pid && qs.cid && qs.lid) {
        affSystem = 'goldtime';
        affId = qs.pid;
        affData = encodeURIComponent('uid=' + qs.uid + '&cid=' + qs.cid + '&lid=' + qs.lid);
    } else if (qs.faff && qs.clickid) {
        affSystem = 'faff';
        affId = qs.faff;
        affData = qs.clickid;
    } else if (qs.faff) {
        affSystem = 'faff';
        affId = qs.faff;
        affData = qs.sub || '';
        if (qs.cid) {
            affData += encodeURIComponent('&cid=') + qs.cid;
        }
    } else if (qs.fref) {
        affSystem = 'fref';
        affId = qs.fref;
        affData = qs.sub || '';
    } else if (qs.btag) {
        let btagArr = '';
        if (qs.btag.indexOf('b_') > 0) {
            affSystem = 'income';
            btagArr = qs.btag.split('b_', 2);
            affId = btagArr[0];
            affData = btagArr[1] ? 'b_' + btagArr[1] : '';
        } else {
            affSystem = 'netrefer';
            btagArr = qs.btag.split('_', 2);
            affId = btagArr[0];

            let affInfo = btagArr[1] || '';
            affData = qs.subid ? affInfo + '_' + qs.subid : affInfo;
        }
    } else if (qs.utm_source) {
        affSystem = qs.utm_source;
        affId = qs.sub || 'unknown';
        affData = qs.clickid || '';
    } else if (qs.qtag) {
        affSystem = 'quintessence';
        affId = 'unknown';
    }

    if (!(bodyElem.length && bodyElem[0].getAttribute('data-affiliate-rewrite-link'))) {
        affCookieData = cookie.get(affCookieName);
        if (affCookieData) {
            window.affCookie = getQueryString(affCookieData);
            if (affSystem !== '') {
                sendLog('0.2.3', {
                    system: affSystem,
                    id: affId,
                });
            }
            return;
        }
    } else {
        if (cookie.get('egass')) {
            cookie.set(affCookieName, '');
        }
    }

    if (affSystem === 'quintessence') {
        if (qs.qtag.indexOf('_p') !== -1) {
            let tags = qs.qtag.split('_p'),
                params = affParams.split('_p');
            affData = tags[0];
            affParams = params[0];
            cookie.set('affPromoCode', tags[1], affMaxAge);
        } else {
            affData = qs.qtag;
            if (cookie.get('affPromoCode')) {
                cookie.delete('affPromoCode');
            }
        }
    }

    if (affSystem !== '') {
        let affdata = {
            system: encodeURIComponent(affSystem),
            id: encodeURIComponent(affId),
            data: encodeURIComponent(affData),
            params: encodeURIComponent(affParams),
        };
        affCookieData = 'system=' + affdata.system +
            '&id=' + affdata.id +
            '&data=' + affdata.data +
            '&params=' + affdata.params;
        window.affCookie = getQueryString(affCookieData);
        cookie.set(affCookieName, affCookieData, affMaxAge);
        setTimeout(function () {
            if (affTrack) {
                let rnd = window.WlcFlog && window.WlcFlog.fingerprint || Math.floor(Math.random() * 10000000000);
                let img = new Image();
                img.onload = function () {
                    sendLog('0.2.0', {
                        detail: affdata,
                    });
                };
                img.onerror = function (error) {
                    sendLog('0.2.1', {
                        detail: affdata,
                        error: error,
                    });
                };
                img.src = '/api/v1/affTrack/track.gif?rnd=' + rnd;
            }
            sendLog('0.2.2', {
                detail: affdata,
            });
        }, 0);
    }
})();
