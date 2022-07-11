export const topicLevels = [
    [3500, 'Masters', 'black'],
    [1500, 'Degree', 'black'],
    [1000, 'A-level', 'brown'],
    [500, 'GCSE Higher', 'blue'],
    [350, 'GCSE-4 to 5', 'green'],
    [250, 'GCSE-3', 'orange'],
    [100, 'FSL1', 'yellow'],
    [-1, 'FSE3', 'white']
]

export const levelLimits = {
    all: {name: 'all', limit: Infinity},
    fse3: {name: 'Functional skills E3', limit: 100},
    fsl1: {name: 'Functional skills L1', limit: 250},
    gcse3: {name: 'GCSE grade 3', limit: 350},
    gcse45: {name: 'GCSE grade 4 to 5', limit: 500},
    gcseH: {name: 'GCSE - higher tier', limit: 1000},
    aLevel: {name: 'A-Level', limit: 1500},
    degree: {name: 'Degree', limit: 5000},
    master: {name: 'Masters', limit: Infinity}
}