import { newRating } from "./ratings";

// track user progress through a single section of a chapter
export class SectionTracker {
    constructor(parentChapter = '', sectionName = '', numberOfCorrectAnswers = 0, numberOfQsAnswered = 0, highestRatingAnsweredCorrectly = 0) {
        this.parentChapter = parentChapter;
        this.sectionName = sectionName;
        this.numberOfCorrectAnswers = numberOfCorrectAnswers;
        this.numberOfQsAnswered = numberOfQsAnswered;
        this.highestRatingAnsweredCorrectly = highestRatingAnsweredCorrectly;
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
    }

    // to make a copy of a SectionTracker
    static from(obj) {
        if (
            !obj.parentChapter || !obj.sectionName ||
            obj.numberOfCorrectAnswers === undefined || obj.numberOfQsAnswered === undefined ||
            obj.highestRatingAnsweredCorrectly === undefined) {
            return console.error('ERROR:: Cannot make a SectionTracker from ', obj)
        }
        return new SectionTracker(
            obj.parentChapter, obj.sectionName,
            obj.numberOfCorrectAnswers, obj.numberOfQsAnswered,
            obj.highestRatingAnsweredCorrectly,
        )
    }
}

// track user progress through a single chapter
export class ChapterTracker {
    constructor(
        chapterName = '', chapterConfidence = 'unknown',
        userRating = 100, listOfSections = {}) {
        this.chapterName = chapterName;
        this.chapterConfidence = chapterConfidence;
        this.userRating = userRating;
        this.listOfSections = listOfSections
    }
    trackNewQ(path = '', correct = false, chapConfidence = 'unknown') {
        let [chapter, section, qName, rating] = path.split('-');
        if (chapter !== this.chapterName) {
            return console.error(`ERROR: attempt to update ${this.parentChapter + '-' + this.sectionName} tracker with q: ${path}`);
        }
        this.chapterConfidence = chapConfidence;
        this.userRating = newRating(this.userRating, Number(rating), correct)
        if (this.listOfSections[section] === undefined) {
            this.listOfSections[section] = new SectionTracker(chapter, section)
        }
        this.listOfSections[section].trackNewQ(path, correct)
        // console.log(`Tracked ${path}, correct:${correct}, userRating:${this.userRating}`)
    }

    // to make a copy of a ChapterTracker
    static from(obj) {
        if (!obj.chapterName || obj.userRating === undefined || obj.listOfSections === undefined) {
            return console.error('ERROR:: Cannot make a ChapterTracker from ', obj)
        }
        let newSectionList = {}
        for (let section in obj.listOfSections) {
            newSectionList[section] = SectionTracker.from(obj.listOfSections[section])
        }
        return new ChapterTracker(
            obj.chapterName, obj.chapterConfidence,
            obj.userRating, newSectionList
        )
    }
}
// this class is intended so that it will store all user progress
export class ProgressTracker {
    constructor(
        title = "Total Progress", listOfChapters = {},
        averageRating = 0, studentRating = 100, mistakeList = new Set(),
        history = [['chapter', 'section', 'qName', 'rating', 'correct?']],
        dateOfLastQ = new Date()) {
        this.title = title;
        this.listOfChapters = listOfChapters;
        this.averageRating = averageRating; // This is average over chapters, not over questions
        this.studentRating = studentRating; // This is the student's rating over all questions
        this.mistakeList = mistakeList;
        this.history = history;
        this.dateOfLastQ = dateOfLastQ;
    }
    trackNewQ(path = '', correct, chapConfidence) {
        this.dateOfLastQ = new Date();
        this.history.push([...path.split('-'), correct]);
        let [chapter, section, qName, rating] = path.split('-');
        rating = Number(rating);
        this.studentRating = newRating(this.studentRating, rating, correct)
        let numOfChapters = Object.keys(this.listOfChapters).length
        let totalOfChapterRatings = this.averageRating * numOfChapters
        if (this.listOfChapters[chapter] === undefined) {
            this.listOfChapters[chapter] = new ChapterTracker(chapter)
            numOfChapters++
        } else {
            totalOfChapterRatings -= this.listOfChapters[chapter].userRating
        }
        this.listOfChapters[chapter].trackNewQ(path, correct, chapConfidence)
        totalOfChapterRatings += this.listOfChapters[chapter].userRating
        this.averageRating = totalOfChapterRatings / numOfChapters;
        if (correct) {
            this.mistakeList.delete(path)
        } else {
            this.mistakeList.add(path)
        }
    }
    getBestAndWorst() {
        let best = { chapter: '', rating: 0 }, worst = { chapter: '', rating: Infinity }
        for (let c in this.listOfChapters) {
            if (this.listOfChapters[c].userRating > best.rating) {
                best = { chapter: c, rating: Math.round(this.listOfChapters[c].userRating) }
            }
            if (this.listOfChapters[c].userRating < worst.rating) {
                worst = { chapter: c, rating: Math.round(this.listOfChapters[c].userRating) }
            }
        }
        return { best, worst }
    }
    copyToCSV() {
        return this.history.map(h => h.join(', '))
    }
    static from(obj) {
        if (!obj.title || obj.listOfChapters === undefined || obj.averageRating === undefined ||
            obj.studentRating === undefined || obj.mistakeList === undefined || obj.history === undefined) {
            return console.error('ERROR:: Cannot make a ProgressTracker from ', obj)
        }
        let newChapterList = {}
        for (let chapter in obj.listOfChapters) {
            newChapterList[chapter] = ChapterTracker.from(obj.listOfChapters[chapter])
        }
        return new ProgressTracker(
            obj.title, newChapterList,
            obj.averageRating, obj.studentRating, new Set([...obj.mistakeList]), [...obj.history],
            obj.dateOfLastQ
        )
    }
}

// to be moved to another file eventually!!
// let qList = [
//     "number-multiplying-ab*c-90", "number-multiplying-ab*cd-95", "number-multiplying-ab*c.d-110",
//     "number-dividing-tablesWithRemainder-80", "number-busStop-noCarry2-110", "number-busStop-noRemainder-150",
//     "fraction-simplify-composite-90", "fraction-ofAmount-manySlices-120",
//     "fraction-add-sameDenom-80", "fraction-add-diffDenomChangeBoth-230", "fraction-add-mixedNumbers-250",
//     "percent-ofAmount-multiplesOf10%-80", "percent-ofAmount-multiplesOf5%-100",
//     "number-multiplying-cubeDigit-65", "number-multiplying-squareEndIn5-70",
//     "ratio-simplify-noUnits2-80", "ratio-simplify-withUnits-150", "ratio-share-givenTotal-200"
// ]
// let correct = [
//     1, 1, 1, 1, 0, 1,
//     1, 1, 1, 1, 0, 0,
//     1, 0, 0, 0, 1, 1
// ]

// export const testProgTracker = new ProgressTracker()
// for (let i = 0; i < qList.length; i++) {
//     let q = qList[i], c = correct[i]
//     testProgTracker.trackNewQ(q, c === 1 ? true : false)
// }
// console.log(JSON.stringify(testProgTracker, null, 2))

// below is used when testing through node
// module.exports = { testProgTracker, ProgressTracker, SectionTracker, ChapterTracker }