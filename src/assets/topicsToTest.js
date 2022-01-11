import { topicsToTest } from 'math-q-factory';
import { Trie } from '../helperFuncs/Trie';

export const qPaths = topicsToTest.map(t => [...t.path, t.rating]);

export const qTrie = new Trie()

let seenWords = new Set();
for (let topic of topicsToTest) {
    if (!['shortAnswer', 'multiChoice', 'sort'].includes(topic.qType)) {continue}
    let slug = topic.path.join('-');
    for (let word of topic.path) {
        if (seenWords.has(word) || word === '') { continue }
        seenWords.add(word);
        qTrie.insert(word, slug);
    }
}
