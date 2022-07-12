const { topicsToTest, totalQs } = require('math-q-factory');
// const { levelLimits } = require('./topicLevels');
const levelLimits = {
    // all: {name: 'all', limit: Infinity},
    fse3: { name: 'Functional skills E3', limit: 100 },
    fsl1: { name: 'Functional skills L1', limit: 250 },
    gcse3: { name: 'GCSE grade 3', limit: 350 },
    gcse45: { name: 'GCSE grade 4 to 5', limit: 500 },
    // gcseH: { name: 'GCSE - higher tier', limit: 1000 },
    // aLevel: { name: 'A-Level', limit: 1500 },
    // degree: { name: 'Degree', limit: 5000 },
    // master: { name: 'Masters', limit: Infinity }
}

const makeSlug = topic => [...topic.path, topic.rating].join('-');
const makeWS = (name, topicList) => { return { name, topicList, creator: 'Math-qs auto worksheet' } }

const listQs = (chapter, limit) => {
    return topicsToTest.filter(t => t.path[0] === chapter && t.rating <= limit)
        .sort((a, b) => a.rating - b.rating)
        .map(makeSlug)
}

console.log(listQs('number', 100))
console.log(totalQs)

const diagnostics = []

for (let lev in levelLimits) {
    let cur = { level: levelLimits[lev].name, topics: [] }
    for (let chapter in totalQs) {
        let qs = listQs(chapter, levelLimits[lev].limit)
        if (qs.length) {
            cur.topics.push(makeWS(`${chapter} questions ${lev}`, qs))
        }
        // else {
        //     console.log(`No qs for ${chapter}, level ${lev} limit ${levelLimits[lev].limit}`)
        // }
    }
    diagnostics.push(cur)
}

console.log(JSON.stringify(diagnostics, null, 2))