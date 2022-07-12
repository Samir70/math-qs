import { diagnostics } from "./diagnostics";
const admin = 'Samir Betmouni';
const gcseIA = {
	name: 'Initial assessment for GCSE at BCG',
	creator: 'Bucks College Group',
	topicList: [
		"number-multiplying-ab*c-90", "number-multiplying-ab*cd-95", "number-multiplying-ab*c.d-110",
		"number-dividing-tablesWithRemainder-80", "number-busStop-noCarry2-110", "number-busStop-noRemainder-150",
		"fraction-simplify-composite-90", "fraction-ofAmount-manySlices-120",
		"fraction-add-sameDenom-80", "fraction-add-diffDenomChangeBoth-230", "fraction-add-mixedNumbers-250",
		"percent-ofAmount-multiplesOf10%-80", "percent-ofAmount-multiplesOf5%-100",
		"number-multiplying-cubeDigit-65", "number-multiplying-squareEndIn5-70",
		"ratio-simplify-noUnits2-80", "ratio-simplify-withUnits-150", "ratio-share-givenTotal-200"
	]
}

const e3nonCalc = {
	name: "Functional Skills E3 non-calculator",
	creator: admin,
	topicList: [
		"wordy-findTotal-EdexcelSampleAQ01-30",
		"wordy-divide-EdexcelSampleAQ02-200",
		"wordy-multiply-EdexcelSampleAQ03-110",
		"wordy-compareMetricUnits-EdexcelSampleAQ04-130"
	]
}

const fsl1ExamQs = {
	name: "Functional skills L1 calculator",
	creator: admin,
	topicList: [
		"examQs-bakeryQ-meanNoBags-210"
	]
}

export const worksheets = [
	gcseIA, e3nonCalc, fsl1ExamQs//, ...diagnostics[1].topics
]
