const extract = (regex, input) => {
    const result = input.match(regex);
    if (result && result.length) {
        return result.length > 1 ? result.slice(1) : result;
    }
    return [];
};

const toDate = (time, day, month, year) => new Date(`${month} ${day}, ${year} ${time}`);

const extractLongDate = ( input ) => {
    return extract(/(Jan|January|Feb|February|Mar|March|Apr|April|May|Jun|June|Jul|July|Aug|August|Sept?|September|Oct|October|Nov|November|Dec|December) ?(\d+)?\s?(\d{4})?\s?a?t?\s?(\d{1,2}:?\d{2}?\s?[AMPamp]*)?/i, input);
};

const extractRelativeDate = ( input ) => {
    return extract(/(mon|monday|tues?|tuesday|wed|wednesday|thurs?|thursday|fri|friday|sat|saturday|sun|sunday)\s?@?\s?(\d+:?\d{0,2})/i, input);
};

const toAbsoluteDate = ( dayPieces ) => {
    const today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    const dayCount = dayShardToId(dayPieces[0]);
    const dayShift = dayCount * (1000*60*60*24);
    const timeShift = timeStringToMilliseconds(dayPieces[1]);
    const day = new Date(today.getTime() + dayShift + timeShift);
    return day;
};

const timeStringToMilliseconds = ( time ) => {
    if (!time) {
        return 1000 * 60 * 60 * 8;
    }
    const isPm = /pm/i.test(time) || (!/am/i.test(time) && parseInt(time, 10) < 8);
    const padding = isPm * 12 * 60 * 60 * 1000;

    if (time.indexOf(':') !== -1) {
        return time.split(':')
            .map(str => parseInt(str, 10))
            .reduce((sum, count, i) => {
                if (i) {
                    return sum + (count * 60);
                }
                return sum + (count * 60 * 60);
            }, padding) * 1000;
    }

    return (parseInt(time, 10) * 60 * 60 * 1000) + padding;
};

const dayShardToId = ( day ) => {
    switch(day.toLowerCase()) {
    case 'mon':
    case 'monday':
        return 1;
    case 'tue':
    case 'tues':
    case 'tuesday':
        return 2;
    case 'wed':
    case 'wednesday':
        return 3;
    case 'thur':
    case 'thurs':
    case 'thursday':
        return 4;
    case 'fri':
    case 'friday':
        return 5;
    case 'sat':
    case 'saturday':
        return 6;
    case 'sun':
    case 'sunday':
        return 7;
    }
};

const extractDate = ( input ) => {
    const date = extractLongDate(input);
    if (date.length) {
        //const hasAll = !!date[3];
        const hasYear = !!date[2];
        const hasDay = !!date[1];

        let month = date[0];
        let day = date[1] || 1;
        let year = date[2] || new Date().getFullYear();
        let time;
        if (!date[3] || (date[3].length === 5 && date[3].split(':').shift() > 24)) {
            time = '08:00';
        } else {
            time = extract(/\d+:\d+/, date[3]).shift();
            if (time.length < 5) {
                const isPm = /pm/i.test(date[3]) || (!/am/i.test(date[3]) && time.split(':').shift() < 8);
                time += isPm ? ' PM' : ' AM';
            }
        }
        let reminderDate = toDate(time, day, month, year);
        const now = new Date();

        if (now > reminderDate) {
            if (!hasYear) {
                reminderDate = toDate(time, day, month, ++year);
                if (reminderDate > now) {
                    return reminderDate;
                }
            }
            if (!hasDay) {
                reminderDate = toDate(time, ++day, month, year);
                if (reminderDate > now) {
                    return reminderDate;
                }
            }
        }
        return reminderDate;
    }

    const day = extractRelativeDate(input);
    if (day.length) {
        return toAbsoluteDate(day);
    }
};

module.exports = {
    dayShardToId,
    extract,
    extractDate,
    extractLongDate,
    extractRelativeDate,
    toAbsoluteDate,
    toDate
};
