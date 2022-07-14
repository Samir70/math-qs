
// track user progress through a single section of a chapter
class SectionTracker {
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
class ChapterTracker {
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
        console.log(`${this.chapterName} is tracking ${path}`)
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
class ProgressTracker {

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

let chapters = {}
for (let q of qList) {
    let chapter = q.split('-')[0]
    if (chapters[chapter] === undefined) {
        chapters[chapter] = new ChapterTracker(chapter)
    }
    chapters[chapter].trackNewQ(q, true)
}
let numCT = ChapterTracker.from(chapters['number'])
numCT.trackNewQ('number-something-forTest-500', true)
numCT.trackNewQ('number-dividing-forTest-300', true)
console.log(JSON.stringify(chapters, null, 2))
console.log(JSON.stringify(numCT, null, 2))