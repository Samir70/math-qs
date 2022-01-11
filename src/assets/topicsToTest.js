import { topicsToTest } from 'math-q-factory';
import { Trie } from '../helperFuncs/Trie';

export const qPaths = topicsToTest.map(t => [...t.path, t.rating]);

export const qTrie = new Trie()

for (let topic of topicsToTest) {
    if (!['shortAnswer', 'multiChoice', 'sort'].includes(topic.qType)) {continue}
    let slug = topic.path.join('-');
    for (let word of topic.path) {
        if (word === '') { continue }
        qTrie.insert(word, slug);
    }
}
