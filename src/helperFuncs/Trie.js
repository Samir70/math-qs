class trieNode {
    constructor(name, q) {
        this.key = name;
        this.children = {};
        this.qList = new Set(q)
    }
}

export class Trie {
    constructor() {
        this.head = {
            val: null,
            children: {}
        }
    }

    insert(word, qPath) {
        var current = this.head;
        for (var w of word) {
            if (current.children[w] === undefined) {
                current.children[w] = new trieNode(w, [qPath])
            } else {
                current.children[w].qList.add(qPath)
            }
            current = current.children[w]
        }
    }

    search(word) {
        var current = this.head;
        for (var w of word) {
            if (current.children[w] === undefined) { return []}
            current = current.children[w]
        }
        return current.qList;
    }
}