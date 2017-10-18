const request = require('request-promise-native');
const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

function getWeapons() {

    const NAME_BLACKLIST = [
        'Rampart',
        'Artemis Bow',
        'Razorwing',
        'Regulator',
        'Exalted Blade',
        'Hysteria',
        'Primal Fury',
        'Diwata',
    ];

    const TAB_BLACKLIST = [
        'Research',
        'Prime',    
    ]

    return request('http://warframe.wikia.com/wiki/Template:WeaponNav')
        .then(response => new JSDOM(response))
        .then(dom => {
            const document = dom.window.document;
            const tabs = document.querySelectorAll('#mw-content-text .tabber .tabbertab[title]');
            return Array.from(tabs)
                .filter(tab => !TAB_BLACKLIST.includes(tab.getAttribute('title')))
                .map(tab => {
                const title = tab.getAttribute('title');
                const itemNodes = tab.querySelectorAll('table.navbox td a[href][title]');
                const items = Array.from(itemNodes)
                    .filter(item => !item.getAttribute('title').startsWith('Category'))
                    .filter(item => !NAME_BLACKLIST.includes(item.getAttribute('title')))
                    .map(item => {
                        const itemData = { name: item.getAttribute('title'), url: item.getAttribute('href') };
                        const subcategoryNode = item.parentNode.previousSibling;
                        if (subcategoryNode && subcategoryNode.classList && subcategoryNode.classList.contains('navboxgroup')) {
                            itemData.subCategory = subcategoryNode.textContent.trim();
                        }
                        return itemData;
                    })
                    .sort((a,b) => a.name < b.name ? -1 : 1);
                return { category: title, items };
            })
        });
}

function getWarframes() {
    return request('http://warframe.wikia.com/wiki/Template:WarframeNav')
        .then(response => new JSDOM(response))
        .then(dom => {
            const document = dom.window.document;
            const frames = document.querySelectorAll('#mw-content-text table.navbox td a[href][title]');
            return Array.from(frames)
                .map(frame => ({ name: frame.getAttribute('title'), url: frame.getAttribute('href') }))
                .sort((a, b) => a.name < b.name ? -1 : 1);
        })
}

Promise.all([
    getWeapons(),
    getWarframes(),
])
    .then(([ weapons, warframes ]) => ({ weapons, warframes }))
    .then(data => {
        fs.writeFileSync(path.resolve(__dirname, 'data', 'data.json'), JSON.stringify(data, null, 2));
        fs.writeFileSync(path.resolve(__dirname, 'data', 'data.min.json'), JSON.stringify(data));
    })
    .catch(console.error)