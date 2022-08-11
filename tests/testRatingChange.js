const { newRating } = require("../src/assets/ratings");

let tests = [
    [100, 80, 1],
    [100, 200, 1],
    [100, 300, 1],
    [100, 600, 1],
    [100, 1200, 1],
    [100, 200, 0],
    [100, 600, 0],
    [100, 1200, 0],
]

tests.forEach(t => {
    console.log(`For ${t.join(', ')} new rating is ${newRating(...t)}`)
})