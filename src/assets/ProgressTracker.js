import { makeBBList } from "math-q-factory";

// track user progress through a single section of a chapter
export class SectionTracker {
    constructor(parentChapter = '', sectionName = '', numberOfCorrectAnswers = 0, numberOfQsAnswered = 0, highestRatingAnsweredCorrectly = 0, pathsOfAnsweredQs = []) {
        this.parentChapter = parentChapter;
        this.sectionName = sectionName;
        this.numberOfCorrectAnswers = numberOfCorrectAnswers;
        this.numberOfQsAnswered = numberOfQsAnswered;
        this.highestRatingAnsweredCorrectly = highestRatingAnsweredCorrectly;
        this.pathsOfAnsweredQs = new Set(pathsOfAnsweredQs)
    }
    trackNewQ(path = '', correct = false) {
        let [chapter, section, qName, rating] = path.split('-')
        if (section !== this.sectionName || chapter !== this.parentChapter) {
            return console.error(`ERROR: attempt to update ${this.parentChapter + '-' + this.sectionName} tracker with q: ${path}`);
        }
        this.numberOfQsAnswered++
        if (correct) {
            this.numberOfCorrectAnswers++
            this.highestRatingAnsweredCorrectly = Math.max(this.highestRatingAnsweredCorrectly, rating)
        }
        this.pathsOfAnsweredQs.add(path)
    }

    // to make a copy of a SectionTracker
    static from(obj) {
        if (!(obj instanceof SectionTracker)) {
            return console.error('ERROR:: Cannot make a SectionTracker from ', obj)
        }
        return new SectionTracker(
            obj.parentChapter, obj.sectionName,
            obj.numberOfCorrectAnswers, obj.numberOfQsAnswered,
            obj.highestRatingAnsweredCorrectly,
            [...obj.pathsOfAnsweredQs]
        )
    }
}

// track user progress through a single chapter
export class ChapterTracker {
    constructor(chapterName = '', numberOfCorrectAnswers = 0, numberOfQsAnswered = 0, highestRatingAnsweredCorrectly = 0, listOfSections = {}) {
        this.chapterName = chapterName;
        this.numberOfCorrectAnswers = numberOfCorrectAnswers;
        this.numberOfQsAnswered = numberOfQsAnswered;
        this.highestRatingAnsweredCorrectly = highestRatingAnsweredCorrectly;
        this.listOfSections = listOfSections
    }
    trackNewQ(path = '', correct = false) {
        let [chapter, section, qName, rating] = path.split('-');
        if (chapter !== this.chapterName) {
            return console.error(`ERROR: attempt to update ${this.parentChapter + '-' + this.sectionName} tracker with q: ${path}`);
        }
        this.numberOfQsAnswered++
        if (correct) {
            this.numberOfCorrectAnswers++
            this.highestRatingAnsweredCorrectly = Math.max(this.highestRatingAnsweredCorrectly, rating)
        }
        if (this.listOfSections[section] === undefined) {
            this.listOfSections[section] = new SectionTracker(chapter, section)
        }
        this.listOfSections[section].trackNewQ(path, correct)
    }

    // to make a copy of a ChapterTracker
    static from(obj) {
        if (!(obj instanceof ChapterTracker)) {
            return console.error('ERROR:: Cannot make a ChapterTracker from ', obj)
        }
        let newSectionList = {}
        for (let section in obj.listOfSections) {
            newSectionList[section] = SectionTracker.from(obj.listOfSections[section])
        }
        return new ChapterTracker(
            obj.chapterName,
            obj.numberOfCorrectAnswers, obj.numberOfQsAnswered,
            obj.highestRatingAnsweredCorrectly, newSectionList
        )
    }
}
// this class is intended so that it will store all user progress
export class ProgressTracker {
    constructor(
        title = "Total Progress", listOfChapters = {}, 
        bestChapter = '', bestRating = 0, worstChapter = '', worstRating = 100000,
        averageRating = 0, mistakeList = new Set(),
        history = [['chapter', 'section', 'qName', 'rating', 'correct?']]) {
        this.title = title;
        this.listOfChapters = listOfChapters;
        this.bestChapter = bestChapter;
        this.bestRating = bestRating;
        this.worstChapter = worstChapter;
        this.worstRating = worstRating;
        this.averageRating = averageRating; // This is average over chapters, not over questions
        this.mistakeList = mistakeList;
        this.history = history;
    }
    trackNewQ(path = '', correct) {
        this.history.push([...path.split('-'), correct]);
        let [chapter, section, qName, rating] = path.split('-');
        rating = Number(rating);
        let numOfChapters = Object.keys(this.listOfChapters).length
        let totalOfChapterBests = this.averageRating * numOfChapters
        if (this.listOfChapters[chapter] === undefined) {
            this.listOfChapters[chapter] = new ChapterTracker(chapter)
            numOfChapters++
        } else {
            totalOfChapterBests -= this.listOfChapters[chapter].highestRatingAnsweredCorrectly
        }
        this.listOfChapters[chapter].trackNewQ(path, correct)
        totalOfChapterBests += this.listOfChapters[chapter].highestRatingAnsweredCorrectly
        this.averageRating = totalOfChapterBests / numOfChapters;
        if (correct) {
            this.mistakeList.delete(path)
            if (rating >= this.bestRating) {
                this.bestRating = rating;
                this.bestChapter = chapter;
            }
            if (chapter === this.worstChapter) {
                this.worstRating = Math.max(this.worstRating, rating)
            }
            if (this.listOfChapters[chapter].highestRatingAnsweredCorrectly <= this.worstRating) {
                this.worstRating = rating;
                this.worstChapter = chapter;
            }
        } else {
            this.mistakeList.add(path)
        }
    }
    copyToCSV() {
        return this.history.map(h => h.join(', '))
    }
    static from(obj) {
        if (!(obj instanceof ProgressTracker)) {
            return console.error('ERROR:: Cannot make a ProgressTracker from ', obj)
        }
        let newChapterList = {}
        for (let chapter in obj.listOfChapters) {
            newChapterList[chapter] = ChapterTracker.from(obj.listOfChapters[chapter])
        }
        return new ProgressTracker(
            obj.title, newChapterList, 
            obj.bestChapter, obj.bestRating, obj.worstChapter, obj.worstRating,
            obj.averageRating, new Set([...obj.mistakeList]), [...obj.history]
        )
    }
}

// to be moved to another file eventually!!
let qList = [
    "number-multiplying-ab*c-90", "number-multiplying-ab*cd-95", "number-multiplying-ab*c.d-110",
    "number-dividing-tablesWithRemainder-80", "number-busStop-noCarry2-110", "number-busStop-noRemainder-150",
    "fraction-simplify-composite-90", "fraction-ofAmount-manySlices-120",
    "fraction-add-sameDenom-80", "fraction-add-diffDenomChangeBoth-230", "fraction-add-mixedNumbers-250",
    "percent-ofAmount-multiplesOf10%-80", "percent-ofAmount-multiplesOf5%-100",
    "number-multiplying-cubeDigit-65", "number-multiplying-squareEndIn5-70",
    "ratio-simplify-noUnits2-80", "ratio-simplify-withUnits-150", "ratio-share-givenTotal-200"
]
let correct = [
    1, 1, 1, 1, 0, 1,
    1, 1, 1, 1, 0, 0,
    1, 0, 0, 0, 1, 1
]

export const testProgTracker = new ProgressTracker()
for (let i = 0; i < qList.length; i++) {
    let q = qList[i], c = correct[i]
    testProgTracker.trackNewQ(q, c === 1 ? true : false)
}
// console.log(JSON.stringify(testProgTracker, null, 2))