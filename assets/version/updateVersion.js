const fs = require('fs');
const moment = require('moment');


const dateNow = moment();
const dateNowVersion = dateNow.format('MMDD');
const buildDate = dateNow.format('YYYY-MM-DD');

//  read previous version number, compare
fs.readFile('./version.json', 'utf-8', (err, content) => {
    let current;
    if (err) {
        current = defaultVersion();
    } else {
        current = JSON.parse(content);
    }
    if (buildDate === current.buildDate) {
        current.iteration = current.iteration + 1;
    } else {
        current.iteration = 0;
        current.buildDate = buildDate;
    }
    if (current.iteration !== 0) {
        current.versionString = `v2.0.${dateNowVersion}-${current.iteration}`;
    } else {
        current.versionString = `v2.0.${dateNowVersion}`;
    }

    const newContent = JSON.stringify(current);

    fs.writeFile('./version.json', newContent, 'utf-8', (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('version updated successfully');
        }
    });
});

const defaultVersion = () => {
    const buildDate = -1;
    const dateNow = new moment().format('MMDD');
    return {
        name: 'Gemba',
        versionString: `v2.0.${dateNow}`,
        iteration: 0,
        buildDate
    };
}