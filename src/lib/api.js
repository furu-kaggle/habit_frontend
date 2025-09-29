const DEFAULT_HEADERS = {
    'Content-Type': 'application/json'
};
const withRequestId = async (response) => {
    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }
    const data = (await response.json());
    if (!data.ok) {
        throw new Error(data.error ?? 'Unknown API error');
    }
    return data;
};
export const fetchClassifiedEvents = async (range = 'today') => {
    const response = await fetch(`/.netlify/functions/events?range=${range}`);
    const data = await withRequestId(response);
    return data.events;
};
export const putOverlayEvent = async (payload) => {
    const response = await fetch('/.netlify/functions/overlay-put', {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload)
    });
    return withRequestId(response);
};
export const removeOverlayEvent = async (payload) => {
    const response = await fetch('/.netlify/functions/overlay-remove', {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(payload)
    });
    return withRequestId(response);
};
export const triggerAutoPlan = async () => {
    const response = await fetch('/.netlify/functions/auto-plan-today', {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({})
    });
    return withRequestId(response);
};
export const quickAddMeal = async (input) => {
    const response = await fetch('/.netlify/functions/meal-quick-add', {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({ input })
    });
    return withRequestId(response);
};
