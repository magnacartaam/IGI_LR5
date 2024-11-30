//------------prototype-based------------
function BaseDateHandler() {
    this.dates = [];
}

BaseDateHandler.prototype = {
    getDates() {
        return this.dates;
    },

    setDates(dates) {
        this.dates = dates;
    },

    addDateFromForm(dayInput, monthInput, yearInput) {
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        
        this.dates.push({ day, month, year });
    },

    displayDatesOnPage(containerElement) {
        containerElement.innerHTML = this.dates.map(date => 
            `Date: ${date.day}/${date.month}/${date.year}`
        ).join('<br>');
    },

    findLatestDate() {
        return this.dates.reduce((latest, current) => {
            if (current.year > latest.year) return current;
            if (current.year < latest.year) return latest;
            
            if (current.month > latest.month) return current;
            if (current.month < latest.month) return latest;
            
            return current.day > latest.day ? current : latest;
        });
    }
};

function ExtendedDateHandler() {
    BaseDateHandler.call(this);
    this.timezone = 'UTC';
}

ExtendedDateHandler.prototype = Object.create(BaseDateHandler.prototype);
ExtendedDateHandler.prototype.constructor = ExtendedDateHandler;

ExtendedDateHandler.prototype.displayLatestDateWithTimezone = function(resultElement) {
    const latestDate = this.findLatestDate();
    resultElement.textContent = `Latest Date (${this.timezone}): 
        ${latestDate.day}/${latestDate.month}/${latestDate.year}`;
};


//-------------class-based---------------
class BaseDateHandlerClass {
    constructor() {
        this.dates = [];
    }

    getDates() {
        return this.dates;
    }

    setDates(dates) {
        this.dates = dates;
    }

    addDateFromForm(dayInput, monthInput, yearInput) {
        const day = parseInt(dayInput.value);
        const month = parseInt(monthInput.value);
        const year = parseInt(yearInput.value);
        
        this.dates.push({ day, month, year });
    }

    displayDatesOnPage(containerElement) {
        containerElement.innerHTML = this.dates.map(date => 
            `Date: ${date.day}/${date.month}/${date.year}`
        ).join('<br>');
    }

    findLatestDate() {
        return this.dates.reduce((latest, current) => {
            if (current.year > latest.year) return current;
            if (current.year < latest.year) return latest;
            
            if (current.month > latest.month) return current;
            if (current.month < latest.month) return latest;
            
            return current.day > latest.day ? current : latest;
        });
    }
}

class ExtendedDateHandlerClass extends BaseDateHandlerClass {
    constructor() {
        super();
        this.timezone = 'UTC';
    }

    displayLatestDateWithTimezone(resultElement) {
        const latestDate = this.findLatestDate();
        resultElement.textContent = `Latest Date (${this.timezone}): 
            ${latestDate.day}/${latestDate.month}/${latestDate.year}`;
    }
}