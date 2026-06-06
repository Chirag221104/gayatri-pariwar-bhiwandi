import { Timestamp } from "firebase/firestore";

/**
 * Normalize a Date to midnight (00:00:00.000) for safe date-only comparisons and duration math.
 */
export function normalizeToMidnight(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
}

/**
 * Convert a Firestore Timestamp or Date to a normalized midnight Date.
 */
export function toDate(value: any): Date {
    if (!value) return new Date();
    if (value instanceof Timestamp) return value.toDate();
    if (value instanceof Date) return value;
    return new Date(value);
}

/**
 * Calculate the inclusive duration in days between two dates.
 * Oct 11 → Oct 12 = 2 days.
 */
export function calculateDuration(start: Date | any, end: Date | any): number {
    const s = normalizeToMidnight(toDate(start));
    const e = normalizeToMidnight(toDate(end));
    const diffMs = e.getTime() - s.getTime();
    if (diffMs < 0) return 1;
    return Math.round(diffMs / (1000 * 60 * 60 * 24)) + 1;
}

/**
 * Check if two dates fall on different calendar days (i.e., event is multi-day).
 */
export function isMultiDay(start: Date | any, end: Date | any): boolean {
    if (!end) return false;
    const s = normalizeToMidnight(toDate(start));
    const e = normalizeToMidnight(toDate(end));
    return e.getTime() > s.getTime();
}

/**
 * Format a date range for display.
 * Single day:          "Oct 11, 2026"
 * Same month:          "Oct 11–12, 2026"
 * Cross-month:         "Oct 30 – Nov 2, 2026"
 * Cross-year:          "Dec 31, 2026 – Jan 1, 2027"
 */
export function formatDateRange(
    start: Date | any,
    end: Date | any,
    locale: string = "en"
): string {
    const s = toDate(start);
    const e = end ? toDate(end) : s;

    const sNorm = normalizeToMidnight(s);
    const eNorm = normalizeToMidnight(e);

    // Single day
    if (sNorm.getTime() === eNorm.getTime()) {
        return s.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    const sYear = s.getFullYear();
    const eYear = e.getFullYear();
    const sMonth = s.getMonth();
    const eMonth = e.getMonth();

    // Same month, same year: "Oct 11–12, 2026"
    if (sYear === eYear && sMonth === eMonth) {
        const monthStr = s.toLocaleDateString(locale, { month: "short" });
        return `${monthStr} ${s.getDate()}–${e.getDate()}, ${sYear}`;
    }

    // Same year, different month: "Oct 30 – Nov 2, 2026"
    if (sYear === eYear) {
        const startStr = s.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
        });
        const endStr = e.toLocaleDateString(locale, {
            day: "numeric",
            month: "short",
        });
        return `${startStr} – ${endStr}, ${sYear}`;
    }

    // Different year: "Dec 31, 2026 – Jan 1, 2027"
    const startFull = s.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    const endFull = e.toLocaleDateString(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
    return `${startFull} – ${endFull}`;
}

/**
 * Format a time range for display.
 * Returns e.g. "10:00 AM – 5:00 PM" or null if no times provided.
 */
export function formatTimeRange(
    startTime: string | null | undefined,
    endTime: string | null | undefined,
    locale: string = "en"
): string | null {
    if (!startTime) return null;

    const formatTime = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        const date = new Date();
        date.setHours(h, m, 0, 0);
        return date.toLocaleTimeString(locale, {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    const startFormatted = formatTime(startTime);
    if (!endTime) return startFormatted;
    const endFormatted = formatTime(endTime);
    return `${startFormatted} – ${endFormatted}`;
}
