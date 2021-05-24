/**
 * Sorting result order:
 * min-height asc
 * max-height desc
 * min-width asc
 * max-width desc
 * pointer
 * pointer and min-width asc
 * pointer and max-width desc
 */


const minMaxWidth = /(!?\(\s*min(-device-)?-width)(.|\n)+\(\s*max(-device)?-width/i;
const maxMinWidth = /(!?\(\s*max(-device)?-width)(.|\n)+\(\s*min(-device)?-width/i;
const minWidth = /\(\s*min(-device)?-width/i;
const maxWidth = /\(\s*max(-device)?-width/i;

const minMaxHeight = /(!?\(\s*min(-device)?-height)(.|\n)+\(\s*max(-device)?-height/i;
const maxMinHeight = /(!?\(\s*max(-device)?-height)(.|\n)+\(\s*min(-device)?-height/i;
const minHeight = /\(\s*min(-device)?-height/i;
const maxHeight = /\(\s*max(-device)?-height/i;

const _testQuery = function (doubleTestTrue, doubleTestFalse, singleTest) {
    return function (query) {
        if (doubleTestTrue.test(query)) {
            return true;
        } else if (doubleTestFalse.test(query)) {
            return false;
        } else {
            return singleTest.test(query);
        }
    };
};

const isMinWidth = _testQuery(minMaxWidth, maxMinWidth, minWidth);
const isMaxWidth = _testQuery(maxMinWidth, minMaxWidth, maxWidth);

const isMinHeight = _testQuery(minMaxHeight, maxMinHeight, minHeight);
const isMaxHeight = _testQuery(maxMinHeight, minMaxHeight, maxHeight);

const _getFirstValue = function (str) {
    const res = /(-?\d*\.?\d+)(px)/.exec(str);
    return res ? parseInt(res[0]) : 0;
};

const _isPointer = function (value) {
    const isPointer = /pointer/i.test(value);
    const isCombined = /and/i.test(value);
    if (isPointer && isCombined) {
        return 2;
    } else if (isPointer) {
        return 1;
    } else {
        return 0;
    }
};

const _bpIndex = function (a) {
    const minAw = isMinWidth(a);
    const maxAw = isMaxWidth(a);
    const minAh = isMinHeight(a);
    const maxAh = isMaxHeight(a);

    if (minAw && minAh) return 2;
    if (minAw && maxAh) return 2;
    if (maxAw && minAh) return 1;
    if (maxAw && maxAh) return 1;
    if (minAw) return 2;
    if (maxAw) return 1;
    if (minAh) return 3;
    if (maxAh) return 4;
};


const sortMqList = function (a, b) {
    const isPointerA = _isPointer(a);
    const isPointerB = _isPointer(b);

    const aIndex = _bpIndex(a);
    const bIndex = _bpIndex(b);

    if (isPointerA || isPointerB) {
        if (isPointerA === 2 && isPointerB === 2) {
            if (aIndex === 2) {
                if (bIndex === 2) return _getFirstValue(a) - _getFirstValue(b);
                if (bIndex === 1) return -1;
            }

            if (aIndex === 1) {
                if (bIndex === 2) return 1;
                if (bIndex === 1) return _getFirstValue(b) - _getFirstValue(a);
            }

            return a.localeCompare(b);
        }
        if (isPointerA === 2) return 1;
        if (isPointerB === 2) return -1;
        if (isPointerA === 1) return 1;
        if (isPointerB === 1) return -1;
    }

    if (aIndex === 2) {
        if (bIndex === 2) return _getFirstValue(a) - _getFirstValue(b);
        if (bIndex === 1) return -1;
    }

    if (aIndex === 1) {
        if (bIndex === 2) return 1;
        if (bIndex === 1) return _getFirstValue(b) - _getFirstValue(a);
    }

    if (aIndex === 3) {
        if (bIndex === 3) return _getFirstValue(a) - _getFirstValue(b);
        if (bIndex === 4) return -1;
    }

    if (aIndex === 4) {
        if (bIndex === 3) return 1;
        if (bIndex === 4) return _getFirstValue(b) - _getFirstValue(a);
    }

    return a.localeCompare(b);
};

module.exports = sortMqList;
