const { obj2Tracker } = require('../src/assets/obj2Tracker');
const { ProgressTracker, testProgTracker } = require('../src/assets/ProgressTracker')

testProgTracker.mistakeList = [...testProgTracker.mistakeList]
const testObj = JSON.parse(JSON.stringify(testProgTracker, null, 2))
console.log(obj2Tracker(testObj))