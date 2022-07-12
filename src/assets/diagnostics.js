const { topicsToTest } = require('math-q-factory');

const makeSlug = topic => [...topic.path, topic.rating].join('-')

const listQs = (chapter, limit) => {
    return topicsToTest.filter(t => t.path[0] === chapter && t.rating <= limit)
        .sort((a, b) => a.rating - b.rating)
        .map(makeSlug)
}

console.log(listQs('number', 100))