import { topicsToTest } from 'math-q-factory';

export const qPaths = topicsToTest.map(t => [...t.path, t.rating]);