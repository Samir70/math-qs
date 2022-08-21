/**
 * 
 * @param {Number} userRating 
 * @param {Number} qRating 
 * @param {Boolean} result 
 */
export const newRating = (userRating, qRating, result) => {
    let m = Math.max(userRating, qRating)
    const transformRating = r => 100 ** (r / m);
    let r1 = transformRating(userRating), r2 = transformRating(qRating);
    let ratingSum = r1 + r2;
    // work out expected win/lose result for user
    let expResult = r1 / ratingSum
    return result ? userRating + (1 - expResult) * 32 : userRating - expResult * 32
}

// module.exports = { newRating }