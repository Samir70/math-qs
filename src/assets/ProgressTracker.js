
// track user progress through a single section of a chapter
class SectionTracker {
    constructor(parentChapter = '', sectionName = '', numberOfQsAnswered = 0, numberOfCorrectAnswers = 0, pathsOfAnsweredQs = [], highestRatingAnsweredCorrectly = 0) {
        this.parentChapter = parentChapter;
        this.sectionName = sectionName;
        this.numberOfQsAnswered = numberOfQsAnswered;
        this.numberOfCorrectAnswers = numberOfCorrectAnswers;
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
        return new SectionTracker(
            obj.parentChapter, obj.sectionName, obj.numberOfQsAnswered,
            obj.numberOfCorrectAnswers,
            [...obj.pathsOfAnsweredQs],
            obj.highestRatingAnsweredCorrectly
        )
    }
}

// track user progress through a single chapter
class ChapterProgress {

}
// this class is intended so that it will store all user progress
class ProgressTracker {

}

const dummySection = new SectionTracker('examQs', 'bakeryQ', 1, 1, ['examQs-bakeryQ-meanNoBags-210'], 210)
console.log(dummySection)
dummySection.trackNewQ('examQs-bakeryQ-someOther-250', true)
console.log(dummySection)
dummy2 = SectionTracker.from(dummySection)
dummy2.trackNewQ('examQs-bakeryQ-someOther-260', true)
dummySection.trackNewQ('examQs-bakeryQ-someOther2-250', true)
console.log(dummySection, dummy2)
