import { topicsToTest } from 'math-q-factory';
import { Trie } from '../helperFuncs/Trie';

export const qPaths = topicsToTest.map(t => [...t.path, t.rating]);

export const qTrie = new Trie()

for (let qp of qPaths) {
    let slug = qp.join('-');
    for (let word of qp.slice(0, 3)) {
        if (word === '') { continue }
        qTrie.insert(word, slug)
    }
}

// qTrie.insert('data', 'data-mean-findmissing-10')
// qTrie.insert('data', 'data-mode-findmissing-10')
// qTrie.insert('mean', 'data-mean-findmissing-10')
// qTrie.insert('findmissing', 'data-mean-findmissing-10')