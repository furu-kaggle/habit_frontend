const timeFormatter = new Intl.DateTimeFormat('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
});
const dateFormatter = new Intl.DateTimeFormat('ja-JP', {
    month: 'short',
    day: 'numeric',
    weekday: 'short'
});
export const formatEventTimeRange = (startIso, endIso) => {
    const start = new Date(startIso);
    const end = new Date(endIso);
    return `${timeFormatter.format(start)} - ${timeFormatter.format(end)}`;
};
export const formatEventDateLabel = (startIso) => {
    const start = new Date(startIso);
    return dateFormatter.format(start);
};
