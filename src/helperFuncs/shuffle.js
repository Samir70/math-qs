// Fisher-Yates shuffle algorithm
export const shuffleFY = arr => {
    let out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1)); // number 0..i
        [out[i], out[j]] = [out[j], out[i]]
    }
    return out
}