const {task} = require('gulp');
const fs = require('fs');
const gettextParser = require('gettext-parser');
const glob = require('glob');
const path = require('path');
const _ = require('lodash');

module.exports = function translationsLogsTask() {

    const searchTranslations = (path) => {
        const files = fs.readdirSync(path);
        const stats = {
            filled: {},
            empty: {},
            missing: {},
        };

        for (const file of files) {
            const [name, extension] = file.split('.');
            if (extension === 'po' && name !== 'en') fileCheck(path, name, stats);
        }

        return stats;
    };

    const searchOldTranslations = (path) => {
        const file = fs.readFileSync(path);
        const result = [];

        file.toString().split('\n').forEach(str => {

            if (str.includes('**Phrase:**')) {
                result.push(str.replace('**Phrase:** ', ''));
            }
        });

        return result;
    };

    const fileCheck = (path, name, stats) => {
        const input = fs.readFileSync(path + name + '.po');
        const po = gettextParser.po.parse(input);
        const translations = po.translations[''];

        for (let translate of Object.keys(translations)) {

            if (translate !== '') {

                const key = translate.replace(/\r|\n/g, '');

                if (translations[translate].msgstr.some(el => el.length)) {
                    stats.filled['all'] = (stats.filled['all'] || 0) + 1;
                    stats.filled[name] = (stats.filled[name] || 0) + 1;
                } else {
                    stats.empty['all'] = (stats.empty['all'] || 0) + 1;
                    stats.empty[name] = (stats.empty[name] || 0) + 1;

                    if (stats.missing[key]) {
                        stats.missing[key].push(name);
                    } else {
                        stats.missing[key] = [name];
                    }
                }
            }
        }
    };

    const report = (path, stats, file, currentDate) => {
        let content = `## Last update: ${currentDate}\n\n`;

        content += `| ${'lang'.padEnd(6)}\t| ${'%'.padEnd(4)}\t|\n`;
        content += '| :-------- | :---- |\n';

        for (item of Object.keys(stats.filled)) {
            content += `| ${item.padEnd(6)}\t| ${percent(stats.filled[item], stats.empty[item])}%\t|\n`;
        }

        content += '\n\n';

        for (item of Object.keys(stats.missing)) {
            content += `**Phrase:** ${item}\n\n**Missing translations:** ${stats.missing[item].join(', ')}\n\n---\n`;
        }

        fs.writeFileSync(`${path}/${file}`, content);
    };

    const reportOnlyNew = (missing, oldTranslation, path, currentDate) => {
        const data = new Date().toLocaleDateString('es-CL');
        let content = '';

        for (let [key, value] of Object.entries(missing)) {

            if (!oldTranslation.includes(key)) {
                content += `**Phrase:** ${key}\n\n**Missing translations:** ${value.join(', ')}\n\n---\n`;
            }
        }

        if (content.length) {
            content = `## New translations on: ${currentDate}\n\n` + content;
            fs.writeFileSync(`${path}/${data}.md`, content);
            clearOld(path);
            generateSummary();
        }
    };

    const generateSummary = () => {
        const children = glob
            .sync(`${this.params.paths.translationLogs}/*.md`)
            .map((file) => ({
                title: path.basename(file, '.md'),
                file: `./1000.translations/history/${path.basename(file)}`,
            }));

        let summary;
        try {
            summary = JSON.parse(
                fs.readFileSync(this.params.paths.docsSummary).toString(),
            );
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log('\n\x1b[31mCompodoc summary read or parse error\x1b[0m\n');
            return false;
        }
        const changeLogs = _.find(summary, (i) => i._id === 'translations');
        changeLogs.children = _.sortBy(children, 'title').reverse();
        fs.writeFileSync(this.params.paths.docsSummary, JSON.stringify(summary, null, 4));
    };

    const clearOld = (path) => {
        const STORY_LENGTH = 5;
        const files = fs.readdirSync(path);

        if (STORY_LENGTH < files.length) {
            const sortFfles = files.sort((a, b) => {
                return b.split('.')[0].split('-').reverse().join('')
                    - a.split('.')[0].split('-').reverse().join('');
            });

            sortFfles.slice(5 - sortFfles.length).forEach(el => {
                fs.unlink(`${path}/history/${el}`, (err) => {
                    if (err) {
                        // eslint-disable-next-line no-console
                        console.log(`failed to delete file: ${el}`);
                    }
                });
            });

            generateSummary();
        }

    };

    const percent = (filled, empty) => {
        return Math.round(filled / (filled + empty) * 100);
    };

    task('translations-logs', async (done) => {
        const languagesDir = fs.existsSync(this.params.paths.languagesDev)
            ? this.params.paths.languagesDev
            : this.params.paths.languagesPack;

        const currentDate = new Date().toDateString();
        const historyPath = this.params.paths.translationLogsDocDist;
        const stats = searchTranslations(languagesDir);
        const oldTranslation = searchOldTranslations(`${historyPath}/1000.translations.md`);

        reportOnlyNew(stats.missing, oldTranslation, `${historyPath}/history`, currentDate);
        report(historyPath, stats, '1000.translations.md', currentDate);

        done();
    });
};
