export function parseBooleanParam(value: string | null, paramName: string): boolean | null {
    if (value === null) return null;
    if (value === 'true') return true;
    if (value === 'false') return false;
    console.error(`Invalid boolean for query param '${paramName}': '${value}'`);
    return null;
}

export function parseStringParam(value: string | null, paramName: string): string {
    if (value === null) return '';
    try {
        return decodeURIComponent(value);
    } catch (err) {
        console.error(`Invalid string encoding for query param '${paramName}': '${value}'`, err);
        return '';
    }
}

export function parseCommaSeparatedListParam(value: string | null, paramName: string): Set<string> {
    if (value === null || value === '') return new Set();
    try {
        const decoded = decodeURIComponent(value);
        const parts = decoded.split(',').map(p => p.trim()).filter(p => p !== '');
        return new Set(parts);
    } catch (err) {
        console.error(`Invalid list for query param '${paramName}': '${value}'`, err);
        return new Set();
    }
}

export function parseDateParam(value: string | null, paramName: string): string {
    if (value === null || value === '') return '';
    try {
        const decoded = decodeURIComponent(value);
        // Require an ISO datetime with 'T' (e.g. 2023-12-09T12:34:56Z or with offset)
        if (!decoded.includes('T')) {
            console.error(`Invalid ISO 8601 timestamp for query param '${paramName}' (missing 'T'): '${value}'`);
            return '';
        }
        const time = Date.parse(decoded);
        if (isNaN(time)) {
            console.error(`Invalid ISO 8601 timestamp value for query param '${paramName}': '${value}'`);
            return '';
        }
        return decoded;
    } catch (err) {
        console.error(`Invalid date encoding for query param '${paramName}': '${value}'`, err);
        return '';
    }
}
