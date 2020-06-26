const gulpConfig = {};


module.exports = function config(root, bundleType) {
    const isEngineBundle = bundleType === 'engine';

    return {
        isEngineBundle,
        paths: {
            root: root,
            nodeModules: `${root}/node_modules`,
            engine: `${root}/node_modules/@egamings/wlc-engine`,
            engineLink: `${root}/wlc-engine`,
            inline: `${root}/wlc-engine/inline`,
            engineDev: `${root}/../wlc-engine`,
            src: root + '/src',
            temp: root + '/temp',
            static: root + '/roots/static',
            vendor: root + '/vendor',
            dist: root + (isEngineBundle ? '/dist' : '/roots/static/dist'),
            locale: root + '/roots/locale',
            localejs: root + '/roots/static/po',
            languages: root + '/src/languages',
            languagesDist: root + '/roots/static/languages',
            localLanguagesDist: root + '/src/static',
            indexFile: `${root}/roots/template/angular.html`,
            srcIndexFile: `${root}/src/index.html`,
        },
        tmpFileName: root + '/temp/tmp_XXXXXXXXX',
        translationDirs: {
            templates: [
                'roots/template'
            ],
            code: [
                'roots/plugins',
                'roots/routing.php',
                'roots/siteconfig.php'
            ]
        },
        locales: {
            "ar": {"code": "en", "label": "Arabic ", "locale": "ar_KW"},
            "it": {"code": "it", "label": "Italian", "locale": "it_IT"},
            "sv": {"code": "sv", "label": "Swedish", "locale": "sv_SV"},
            "cn": {"code": "cn", "label": "China", "locale": "cn_CN"},
            "de": {"code": "de", "label": "German", "locale": "de_DE"},
            "en": {"code": "en", "label": "English", "locale": "en_US"},
            "es": {"code": "es", "label": "Spanish", "locale": "es_ES"},
            "fa": {"code": "fa", "label": "Persian", "locale": "fa_FA"},
            "fr": {"code": "fr", "label": "French", "locale": "fr_FR"},
            "hi": {"code": "hi", "label": "Hindi", "locale": "hi_IN"},
            "id": {"code": "id", "label": "Indonesian", "locale": "id_ID"},
            "ja": {"code": "ja", "label": "Japanese", "locale": "ja_JP"},
            "ko": {"code": "ko", "label": "Korean", "locale": "ko_KR"},
            "kr": {"code": "ko", "label": "Korean", "locale": "ko_KR"},
            "mn": {"code": "mn", "label": "Mongolian", "locale": "mn_MN"},
            "pl": {"code": "pl", "label": "Polski", "locale": "pl_PL"},
            "pt": {"code": "pt", "label": "Portuguese", "locale": "pt_PT"},
            "pt-br": {"code": "pt-br", "label": "Portuguese", "locale": "pt_BR"},
            "ru": {"code": "ru", "label": "Russian", "locale": "ru_RU"},
            "tr": {"code": "tr", "label": "Turkish", "locale": "ru_RU"},
            "vi": {"code": "vi", "label": "Vietnamese", "locale": "vi_VN"},
            "zh": {"code": "zh", "label": "Chinese", "locale": "zh_ZH"},
            "zh-cn": {"code": "zh-cn", "label": "China", "locale": "zh_CN"},
            "zh-hans": {"code": "zh-hans", "label": "Chinese", "locale": "zh_Hans"},
            "zh-hant": {"code": "zh-hant", "label": "Chinese", "locale": "zh_Hant"}
        }
    };
};
