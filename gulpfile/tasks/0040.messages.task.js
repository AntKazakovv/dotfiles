const {task, src, dest, series} = require('gulp'),
    fs = require('fs'),
    _ = require('lodash'),
    stream = require('stream'),
    gettext = require('gulp-angular-gettext'),
    jeditor = require('gulp-json-editor'),
    rename = require('gulp-rename'),
    tmp = require('tmp')
    ;

module.exports = function messagesTask() {
    task('message:temp_front_po', (cb) => {  // Done
        const commands = _.keys(this.params.locales).map(locale => {
            const poFilePath = this.params.paths.src + `/languages/frontend/${locale}.po`,
                enginePoFilePath = this.params.paths.engineLink + `/system/languages/${locale}.po`;

            return `msgcat --force-po --lang=${locale} ` +
                `${(fs.existsSync(poFilePath)) ? `--use-first ${poFilePath}` : ''} ` +
                `${(fs.existsSync(enginePoFilePath)) ? ` ${enginePoFilePath}` : ''} ` +
                ` > ${this.params.paths.temp}/frontend_${locale}.po\n`;
        });

        const writable = new stream.Writable({
            write: function (chunk, encoding, next) {
                next();
            },
        });

        this.execShell(commands, true).then(() => cb());
    });

    task('message:po_to_json', () => {  // Done
        return src(`${this.params.paths.temp}/frontend_*.po`)
            .pipe(gettext.compile({
                format: 'json',
            }))
            .pipe(jeditor((json) => {
                const locale = _.keys(json)[0];
                return json[locale];
            }))
            .pipe(rename(path => {
                path.basename = path.basename.replace('frontend_', '');
            }))
            .pipe(dest(`${this.params.paths.languagesDist}`));
    });

    task('message:temp_back_po', (cb) => {
        const commands =
            _.values(this.params.locales).map(locale => {
                const poFilePath = this.params.paths.src + `/languages/backend/messages/${locale.code}.po`,
                    loyaltyPoFilePath = this.params.paths.src + `/languages/backend/loyalty/${locale.code}.po`,
                    vendorPoFilePath = this.params.paths.vendor + `/egamings/wlc_core/root/locale/${locale.locale}/LC_MESSAGES/messages.po`,
                    vendorLoyaltyPoFilePath = this.params.paths.vendor
                        + `/egamings/wlc_core/root/locale/${locale.locale}/LC_MESSAGES/loyalty.po`;

                return `msgcat --force-po --lang=${locale.code} ` +
                    `${(fs.existsSync(poFilePath)) ? `--use-first ${poFilePath} ` : ''} ` +
                    `${(fs.existsSync(vendorPoFilePath)) ? ` ${vendorPoFilePath}` : ''} ` +
                    ` > ${this.params.paths.temp}/backend_messages_${locale.locale}.po\n` +
                    `msgcat --force-po --lang=${locale.code} ` +
                    `${(fs.existsSync(loyaltyPoFilePath)) ? `--use-first ${loyaltyPoFilePath}` : ''} ` +
                    `${(fs.existsSync(vendorLoyaltyPoFilePath)) ? ` ${vendorLoyaltyPoFilePath}` : ''} ` +
                    ` > ${this.params.paths.temp}/backend_loyalty_${locale.locale}.po\n`;
            });

        this.execShell(commands, true).then(() => cb());
    });

    task('message:po_to_mo', (cb) => {
        const commands =
            _.values(this.params.locales).map(locale => {
                let mkdirCommand = '';
                if (!fs.existsSync(`${this.params.paths.locale}/${locale.locale}/LC_MESSAGES/`)) {
                    mkdirCommand = `mkdir -p ${this.params.paths.locale}/${locale.locale}/LC_MESSAGES\n`;
                }
                return mkdirCommand +
                    `msgfmt ${this.params.paths.temp}/backend_messages_${locale.locale}.po ` +
                    `-o ${this.params.paths.locale}/${locale.locale}/LC_MESSAGES/messages.mo\n` +
                    `msgfmt ${this.params.paths.temp}/backend_loyalty_${locale.locale}.po ` +
                    `-o ${this.params.paths.locale}/${locale.locale}/LC_MESSAGES/loyalty.mo\n`;
            });

        this.execShell(commands, true).then(() => cb());
    });

    task('message:translationstwig', (cb) => {
        const command = 'echo "Translations Templates: Status - 0 means all strings are translated";' +
            `find ${this.params.paths.locale}` +
            ' -iname "*.po" -exec echo -n {} \': \' \\; -exec sh -c \'msgattrib --untranslated {} ' +
            '| grep "msgstr \\"\\"" | wc -l \' \\;';

        this.execShell(command, true).then(() => cb());
    });

    task('message:translationsjs', (cb) => {
        const command = 'echo "Translations JavaScript: Status - 0 means all strings are translated";' +
            `find ${this.params.paths.localejs}` +
            ' -iname "*.po" -exec echo -n {} \': \' \\; -exec sh -c \'msgattrib --untranslated {} ' +
            '| grep "msgstr \\"\\"" | wc -l \' \\;';

        this.execShell(command, true).then(() => cb());
    });

    task('message:tpl_to_pot', async (cb) => {  //Done
        const tmpFile = tmp.fileSync(this.params.tmpFileOptions);
        const commands = _.map(this.params.translationDirs.templates, (templateDir) => {
            return `echo 'tpl to POT -> ${templateDir}'\n` +
                `find ${this.params.paths.root}/${templateDir} -type f -name '*.tpl' -print >> ${tmpFile.name}\n`;
        });

        const extractCommand = `TMPDIR=${this.params.paths.temp} ${this.params.paths.root}`
            + '/vendor/bin/tpl-gettext-extractor --sort-output --no-location '
            + `--force-po -o ${this.params.paths.temp}/messages_tpl.pot`
            + ' --keyword="trans" --keyword="transchoice" --keyword="_" --keyword="gettext"' +
            ` --files \`cat ${tmpFile.name}\`\n`;

        await this.execShell(commands, true);
        await this.execShell(extractCommand, true);

        // fix date update
        await this.execShell(
            `sed -i 's/"POT-Creation-Date.*/"POT-Creation-Date: 1970-01-01 00:00+0000\\\\n"/' ${this.params.paths.temp}/messages_tpl.pot`,
            true,
        );
        cb();
    });

    task('message:php_to_pot', async (cb) => {  //Done
        const tmpFile = tmp.fileSync(this.params.tmpFileOptions);
        let commands =
            _.map(this.params.translationDirs.code, codeDir => {
                return `echo 'php to POT -> ${this.params.paths.root}/${codeDir}'\n` +
                    `find ${this.params.paths.root}/${codeDir} -type f -name '*.php' -print >> ${tmpFile.name}\n`;
            }),
            getTextCommand = `xgettext -L PHP --force-po -f ${tmpFile.name} -o ${this.params.paths.temp}/messages_php.pot\n`
                +  `sed --in-place ${this.params.paths.temp}/messages_php.pot --expression="s|#:[[:space:]]${this.params.paths.root}|#: |"\n`;

        await this.execShell(commands, true);
        await this.execShell(getTextCommand, true);
        cb();
    });

    task('message:merge_backend_pot', async (cb) => { // Done

        const msgCatCommand = `msgcat ${this.params.paths.temp}/messages_tpl.pot ` +
            `${this.params.paths.temp}/messages_php.pot > ` +
            `${this.params.paths.temp}/custom_backend.pot\n`;

        const commands = [
            msgCatCommand,
            `sed --in-place ${this.params.paths.temp}/custom_backend.pot --expression=s/CHARSET/UTF-8/\n`,
            `sed --in-place ${this.params.paths.temp}/custom_backend.pot --expression=s/fuzzy//\n`,
        ];

        await this.execShellSync(commands, true);

        cb();
    });

    task('message:back_message_pot_to_po', async (cb) => {  // Done

        let commands = _.keys(this.params.locales).map(locale => {

            const poFilePath = this.params.paths.src + `/languages/backend/messages/${locale}.po`;
            if (fs.existsSync(poFilePath)) {
                return `sed --in-place ${poFilePath} --expression=s/CHARSET/UTF-8/\n` +
                    `sed --in-place ${poFilePath} --expression=s/fuzzy//\n` +

                    `msgmerge --force-po --lang=${locale} ` +
                    `${poFilePath} ` +
                    `${this.params.paths.temp}/custom_backend.pot ` +
                    `-o ${this.params.paths.src}/languages/backend/messages/${locale}.po\n` +

                    `sed -i 's/#~ //g' ${this.params.paths.src}/languages/backend/messages/${locale}.po\n`;
            } else {
                return `msgcat --force-po --lang=${locale} ` +
                    `${this.params.paths.temp}/custom_backend.pot ` +
                    `> ${this.params.paths.src}/languages/backend/messages/${locale}.po\n`;
            }

        });

        await this.execShell(commands, true);

        cb();
    });

    task('message:front_to_pot', () => {  // Done
        return src([
            this.params.paths.src + '/**/*.ts',
            this.params.paths.src + '/**/*.js',
            this.params.paths.src + '/**/*.html',
            '!' + this.params.paths.src + '/custom/**/~*.*',
        ])
            .pipe(gettext.extract('front.pot', {}))
            .pipe(dest(this.params.paths.temp));
    });

    task('message:front_pot_to_po', async (cb) => {  // Done

        let commands = _.keys(this.params.locales).map(locale => {
            const poFilePath = this.params.paths.src
                + `${this.params.isEngineBundle ? '/system' : ''}`
                + `/languages/${this.params.isEngineBundle ? '' : 'frontend/'}${locale}.po`;
            if (fs.existsSync(poFilePath)) {
                return `msgmerge --force-po --no-fuzzy-matching --update --backup=off --lang=${locale} ` +
                    `${poFilePath} ${this.params.paths.temp}/front.pot \n` +
                    `sed -i 's/#~ //g' ${poFilePath}\n`;
            } else {
                return `msgcat --force-po --lang=${locale} ` +
                    `${this.params.paths.temp}/front.pot > ${poFilePath}\n`;
            }
        });

        await this.execShell(commands, true);

        cb();
    });

    task('message:merge_engine_pot', async (cb) => {
        const commands = [
            `mv ${this.params.paths.temp}/front.pot ${this.params.paths.temp}/engine.pot \n`,
            `msgcat ${this.params.paths.temp}/engine.pot `
                + `${this.params.paths.src}/system/languages/messages.pot > ${this.params.paths.temp}/front.pot\n`,
        ];

        await this.execShell(commands, true);

        cb();
    });

    task('messages', series(
        'clean:temp',
        'message:tpl_to_pot',
        'message:php_to_pot',
        'message:merge_backend_pot',
        'message:back_message_pot_to_po',
        'message:front_to_pot',
        'message:front_pot_to_po',
        'message:temp_front_po',
        'message:po_to_json',
        'clean:temp',
    ));

    task('engineMessages', series(
        'clean:temp',
        'message:front_to_pot',
        'message:merge_engine_pot',
        'message:front_pot_to_po',
        'message:temp_front_po',
        'clean:temp',
    ));
};
