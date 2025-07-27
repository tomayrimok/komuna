
export const toLocalDateString = (date: Date): string => {
    return date.toLocaleDateString('he-IL');
};

// New function for HTML date inputs that require ISO format (YYYY-MM-DD)
// This preserves the local date without timezone conversion
export const toISODateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};


export const toDateOnly = (date: Date): Date => {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly;
};


export const getTodayDateOnly = (): Date => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
};

export const getTomorrowDateOnly = (): Date => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
};


export const parseDate = (dateInput: string | Date): Date => {
    if (dateInput instanceof Date) {
        return dateInput;
    }
    return new Date(dateInput);
};

export const compareDateOnly = (date1: Date, date2: Date): number => {
    const d1 = toDateOnly(date1);
    const d2 = toDateOnly(date2);

    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
};


export const isToday = (date: Date): boolean => {
    return compareDateOnly(date, new Date()) === 0;
};

export const isTomorrow = (date: Date): boolean => {
    return compareDateOnly(date, getTomorrowDateOnly()) === 0;
};


export const isPast = (date: Date): boolean => {
    return compareDateOnly(date, new Date()) < 0;
};


export const isFuture = (date: Date): boolean => {
    return compareDateOnly(date, new Date()) > 0;
}; 