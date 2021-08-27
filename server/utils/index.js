"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get2DayChange = exports.getPercentChange = exports.currentTimestamp = exports.escapeRegExp = void 0;
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
exports.escapeRegExp = escapeRegExp;
const currentTimestamp = () => new Date().getTime();
exports.currentTimestamp = currentTimestamp;
/**
 * get standard percent change between two values
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 */
const getPercentChange = (valueNow, value24HoursAgo) => {
    if (valueNow && value24HoursAgo) {
        const change = ((parseFloat(valueNow) - parseFloat(value24HoursAgo)) / parseFloat(value24HoursAgo)) * 100;
        if (isFinite(change))
            return change;
    }
    return 0;
};
exports.getPercentChange = getPercentChange;
/**
 * gets the amoutn difference plus the % change in change itself (second order change)
 * @param {*} valueNow
 * @param {*} value24HoursAgo
 * @param {*} value48HoursAgo
 */
const get2DayChange = (valueNow, value24HoursAgo, value48HoursAgo) => {
    // get volume info for both 24 hour periods
    const currentChange = parseFloat(valueNow) - parseFloat(value24HoursAgo);
    const previousChange = parseFloat(value24HoursAgo) - parseFloat(value48HoursAgo);
    const adjustedPercentChange = ((currentChange - previousChange) / previousChange) * 100;
    if (isNaN(adjustedPercentChange) || !isFinite(adjustedPercentChange)) {
        return [currentChange, 0];
    }
    return [currentChange, adjustedPercentChange];
};
exports.get2DayChange = get2DayChange;
