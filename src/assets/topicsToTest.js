import { topicsToTest } from 'math-q-factory';
import { Trie } from '../helperFuncs/Trie';

export const qPaths = topicsToTest.map(t => [...t.path, t.rating]);

export const qTrie = new Trie()

qTrie.insert('data', 'data-mean-findmissing-10')
qTrie.insert('data', 'data-mode-findmissing-10')
qTrie.insert('mean', 'data-mean-findmissing-10')
qTrie.insert('findmissing', 'data-mean-findmissing-10')