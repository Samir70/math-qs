import { topicsToTest, totalQs } from 'math-q-factory';
import  { levelLimits } from './topicLevels';

const makeSlug = topic => [...topic.path, topic.rating].join('-');
const makeWS = (name, topicList) => { return { name, topicList, creator: 'Math-qs auto worksheet' } }

const listQs = (chapter, limit) => {
    return topicsToTest.filter(t => t.path[0] === chapter && t.rating <= limit)
        .sort((a, b) => a.rating - b.rating)
        .map(makeSlug)
}

export const diagnostics = []

for (let lev in levelLimits) {
    let cur = { level: levelLimits[lev].name, topics: [] }
    for (let chapter in totalQs) {
        let qs = listQs(chapter, levelLimits[lev].limit)
        if (qs.length) {
            cur.topics.push(makeWS(`${chapter} - upto ${levelLimits[lev].name}`, qs))
        }
    }
    diagnostics.push(cur)
}