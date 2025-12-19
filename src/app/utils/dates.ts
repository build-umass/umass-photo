const monthMap = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export function formatDate(date: Date): string {
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const hours = date.getHours() % 12 || 12;
    const timeString = date.getSeconds() === 0 ?
        `${hours}:${date.getMinutes().toString().padStart(2, '0')} ${ampm}` :
        `${hours}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')} ${ampm}`;
    return `${monthMap[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} | ${timeString}`;
}
