import { SectionTracker, ChapterTracker, ProgressTracker } from './ProgressTracker';

const obj2Chapter = (obj) => {
    const sections = {}
    for (let s in obj.listOfSections) {
        sections[s] = SectionTracker.from(obj.listOfSections[s])
    }
    return {
        chapterName: obj.chapterName,
        chapterConfidence: obj.chapterConfidence,
        userRating: obj.userRating,
        listOfSections: sections
    }
}

export const obj2Tracker = (obj) => {
    // console.log('Wanting to convert ', obj, 'to a ProgressTracker');
    const chapters = {};
    for (let c in obj.listOfChapters) {
        // console.log(obj2Chapter(obj.listOfChapters[c]))
        chapters[c] = ChapterTracker.from(obj2Chapter(obj.listOfChapters[c]))
    }
    return ProgressTracker.from({
        title: obj.title,
        listOfChapters: chapters,
        averageRating: obj.averageRating,
        mistakeList: new Set(obj.mistakeList),
        history: obj.history,
        dateOfLastQ: obj.dateOfLastQ,
    })
}

// module.exports = { obj2Tracker }