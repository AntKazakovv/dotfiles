const fs = require('fs');

module.exports = function config(root, bundleType, pathsConfig = {}) {
    const isEngineBundle = bundleType === 'engine';
    const isMobileAppBundle = bundleType === 'mobileApp';

    const langsDev = '../wlc-engine-translate';
    const langsPack = './node_modules/@egamings/wlc-engine-translate';
    const localesFile = 'locales.json';

    let locales;
    try {
        locales = JSON.parse(fs.readFileSync(
            (fs.existsSync(`${langsDev}/${localesFile}`) ? langsDev : localesPack)
            + `/${localesFile}`,
        ));
    } catch (error) {
        locales = defaultLangs;
    }

    return {
        isEngineBundle,
        isMobileAppBundle,
        paths: {
            root: root,
            nodeModules: `${root}/node_modules`,
            engine: `${root}/node_modules/@egamings/wlc-engine`,
            engineLink: `${root}/wlc-engine`,
            inline: `${root}/wlc-engine/system/inline`,
            engineDev: `${root}/../wlc-engine`,
            src: root + '/src',
            temp: root + '/temp',
            static: root + (isMobileAppBundle ? '/static' : '/roots/static'),
            vendor: root + '/vendor',
            dist: isMobileAppBundle ? root + '/staticTmp' : root + (isEngineBundle ? '/dist' : '/roots/static/dist'),
            locale: root + '/roots/locale',
            localejs: root + '/roots/static/po',
            languagesDev: langsDev,
            languagesPack: langsPack,
            localesFile: localesFile,
            locales: `${root}/${localesFile}`,
            languages: root + '/src/languages',
            languagesDist: root + '/roots/static/languages',
            localLanguagesDist: root + '/src/static',
            indexFile: isMobileAppBundle ? `${root}/www/angular.html` : `${root}/roots/template/angular.html`,
            indexHeadFile: isMobileAppBundle ? `${root}/www/head.tpl` : `${root}/roots/template/head.tpl`,
            srcIndexFile: `${root}/src/index.html`,
            srcIndexHeadFile: `${root}/node_modules/@egamings/wlc-engine/src/head.tpl`,
            polyfillsFile: `${root}/src/polyfills.ts`,
            docsSummary: `${root}/src/docs/content/summary.json`,
            changeLogs: `${root}/src/docs/content/900.change-logs/releases`,
            changeLogsDocDist: `${root}/src/docs/content/900.change-logs`,
            translationLogs: `${root}/src/docs/content/1000.translations/history`,
            translationLogsDocDist: `${root}/src/docs/content/1000.translations`,
            apiTest: `${root}/api-tests`,
            ...pathsConfig,
        },
        tmpFileOptions: {
            tmpdir: root + '/temp',
            template: 'tmp_XXXXXXXXX',
        },
        translationDirs: {
            templates: [
                'roots/template',
            ],
            code: [
                'roots/plugins',
                'roots/routing.php',
                'roots/siteconfig.php',
            ],
        },
        locales: locales,
        sassDocOptions: {
            dest: `${root}/docs/sassdoc`,
            verbose: true,
            groups: {
                'global': 'Global',
            },
        },
    };
};


const defaultLangs = {
    'au': {'code': 'au', 'label': 'Australian', 'locale': 'au_AU'},
    'az': {'code': 'az', 'label': 'Azerbaijan', 'locale': 'az_AZ'},
    'ca': {'code': 'ca', 'label': 'Canadian', 'locale': 'en_CA'},
    'ar': {'code': 'ar', 'label': 'Arabic ', 'locale': 'ar_KW'},
    'bg': {'code': 'bg', 'label': 'Bulgarian', 'locale': 'bg_BG'},
    'cn': {'code': 'cn', 'label': 'China', 'locale': 'cn_CN'},
    'cs': {'code': 'cs', 'label': 'Czech', 'locale': 'cs_CZ'},
    'da': {'code': 'da', 'label': 'Danish', 'locale': 'da_DK'},
    'de': {'code': 'de', 'label': 'German', 'locale': 'de_DE'},
    'ee': {'code': 'ee', 'label': 'Estonian', 'locale': 'et_EE'},
    'el': {'code': 'el', 'label': 'Greece', 'locale': 'el_GR'},
    'el-gr': {'code': 'el-gr', 'label': 'Greece', 'locale': 'el_GR'},
    'en': {'code': 'en', 'label': 'English', 'locale': 'en_US'},
    'nz': {'code': 'nz', 'label': 'English', 'locale': 'en_NZ'},
    'enc': {'code': 'enc', 'label': 'Canadian english', 'locale': 'en_CA'},
    'en-ph': {'code': 'en-ph', 'label': 'Philippines', 'locale': 'en_PH'},
    'ph': {'code': 'ph', 'label': 'Philippines', 'locale': 'en_PH'},
    'es': {'code': 'es', 'label': 'Spanish', 'locale': 'es_ES'},
    'es-mx': {'code': 'es-mx', 'label': 'Spanish', 'locale': 'es_MX'},
    'sp': {'code': 'sp', 'label': 'Spanish', 'locale': 'es_SP'},
    'fa': {'code': 'fa', 'label': 'Persian', 'locale': 'fa_FA'},
    'fi': {'code': 'fi', 'label': 'Suomi', 'locale': 'fi_FI'},
    'fr': {'code': 'fr', 'label': 'French', 'locale': 'fr_FR'},
    'he': {'code': 'he', 'label': 'Hebrew', 'locale': 'he_IL'},
    'hi': {'code': 'hi', 'label': 'Hindi', 'locale': 'hi_IN'},
    'hr': {'code': 'hr', 'label': 'Croatian', 'locale': 'hr_HR'},
    'hu': {'code': 'hu', 'label': 'Magyar', 'locale': 'hu_HU'},
    'id': {'code': 'id', 'label': 'Indonesian', 'locale': 'id_ID'},
    'ie': {'code': 'ie', 'label': 'Irish', 'locale': 'en_IE'},
    'is': {'code': 'is', 'label': 'Íslendingar', 'locale': 'is_IS'},
    'it': {'code': 'it', 'label': 'Italian', 'locale': 'it_IT'},
    'ja': {'code': 'ja', 'label': 'Japanese', 'locale': 'ja_JP'},
    'ka': {'code': 'ka', 'label': 'Georgia', 'locale': 'ka'},
    'ko': {'code': 'ko', 'label': 'Korean', 'locale': 'ko_KR'},
    'kr': {'code': 'ko', 'label': 'Korean', 'locale': 'ko_KR'},
    'kk': {'code': 'kk', 'label': 'Kazakh', 'locale': 'kk_KZ'},
    'kg': {'code': 'kg', 'label': 'Kyrgyzstan', 'locale': 'ru_KG'},
    'mn': {'code': 'mn', 'label': 'Mongolian', 'locale': 'mn_MN'},
    'ms': {'code': 'ms', 'label': 'Malay', 'locale': 'ms_MY'},
    'mt': {'code': 'mt', 'label': 'Maltese', 'locale': 'mt_MT'},
    'nl': {'code': 'nl', 'label': 'Nederlands', 'locale': 'nl_BE'},
    'no': {'code': 'no', 'label': 'Norwegian', 'locale': 'no_NO'},
    'pl': {'code': 'pl', 'label': 'Polski', 'locale': 'pl_PL'},
    'pt': {'code': 'pt', 'label': 'Portuguese', 'locale': 'pt_PT'},
    'pt-br': {'code': 'pt-br', 'label': 'Portuguese', 'locale': 'pt_BR'},
    'ro': {'code': 'ro', 'label': 'Romanian', 'locale': 'ro_RO'},
    'ru': {'code': 'ru', 'label': 'Russian', 'locale': 'ru_RU'},
    'sk': {'code': 'sk', 'label': 'Slovak', 'locale': 'sk_SK'},
    'sl': {'code': 'sl', 'label': 'Slovenian', 'locale': 'sl_SI'},
    'sq': {'code': 'sq', 'label': 'Albanian', 'locale': 'sq_AL'},
    'sr': {'code': 'sr', 'label': 'Serbian', 'locale': 'sr_RS'},
    'sv': {'code': 'sv', 'label': 'Swedish', 'locale': 'sv_SE'},
    'tg': {'code': 'tg', 'label': 'Tajik', 'locale': 'tg'},
    'th': {'code': 'th', 'label': 'Thai', 'locale': 'th_TH'},
    'tr': {'code': 'tr', 'label': 'Turkish', 'locale': 'tr_TR'},
    'tt': {'code': 'tt', 'label': 'Tatar', 'locale': 'tt_RU'},
    'ua': {'code': 'ua', 'label': 'Ukrainian', 'locale': 'ua_UA'},
    'uz': {'code': 'uz', 'label': 'Uzbek', 'locale': 'uz_UZ'},
    'vi': {'code': 'vi', 'label': 'Vietnamese', 'locale': 'vi_VN'},
    'zh': {'code': 'zh', 'label': 'Chinese', 'locale': 'zh_ZH'},
    'zh-cn': {'code': 'zh-cn', 'label': 'China', 'locale': 'zh_CN'},
    'zh-hans': {'code': 'zh-hans', 'label': 'Chinese', 'locale': 'zh_Hans'},
    'zh-hant': {'code': 'zh-hant', 'label': 'Chinese', 'locale': 'zh_Hant'},
};
