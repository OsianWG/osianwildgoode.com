function updateClock() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Check for custom parameters
    const keys = ['showDayOfTheWeek', 'showDayNumber', 'showMonth', 'showYear', 'showHours', 'showMinutes', 'showSeconds', 'showAmpm'];
    const hasCustomParams = keys.some(key => urlParams.has(key));

    const now = new Date();
    let displayString = "";

    if (!hasCustomParams) {
        // --- DEFAULT LAYOUT (FRI 27 FEB 2026 06:42:11PM) ---
        const dayName = now.toLocaleDateString(undefined, { weekday: 'short' });
        const dayNum  = now.getDate();
        const month   = now.toLocaleDateString(undefined, { month: 'short' });
        const year    = now.getFullYear();
        
        // Time components
        let hours = now.getHours();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12; // 12-hour format
        const h = hours.toString().padStart(2, '0');
        const m = now.getMinutes().toString().padStart(2, '0');
        const s = now.getSeconds().toString().padStart(2, '0');

        displayString = `${dayName} ${dayNum} ${month} ${year} ${h}:${m}:${s}${ampm}`;
        
    } else {
        // --- CUSTOM PARAMETER LAYOUT ---
        let dateParts = [];
        let timeParts = [];

        if (urlParams.get('showDayOfTheWeek') === 'true') dateParts.push(now.toLocaleDateString(undefined, { weekday: 'short' }));
        if (urlParams.get('showDayNumber') === 'true')    dateParts.push(now.getDate());
        if (urlParams.get('showMonth') === 'true')        dateParts.push(now.toLocaleDateString(undefined, { month: 'short' }));
        if (urlParams.get('showYear') === 'true')         dateParts.push(now.getFullYear());

        let hours = now.getHours();
        const isAmpm = urlParams.get('showAmpm') === 'true';
        const ampmLabel = hours >= 12 ? 'PM' : 'AM';

        if (isAmpm) hours = hours % 12 || 12;
        else hours = hours.toString().padStart(2, '0');

        if (urlParams.get('showHours') === 'true')   timeParts.push(hours.toString().padStart(2, '0'));
        if (urlParams.get('showMinutes') === 'true') timeParts.push(now.getMinutes().toString().padStart(2, '0'));
        if (urlParams.get('showSeconds') === 'true') timeParts.push(now.getSeconds().toString().padStart(2, '0'));

        const dateStr = dateParts.join(' ');
        let timeStr = timeParts.join(':');
        if (isAmpm && timeParts.length > 0) timeStr += ampmLabel;

        displayString = [dateStr, timeStr].filter(Boolean).join(' ');
    }

    document.getElementById('clock-container').innerText = displayString;
}

setInterval(updateClock, 1000);
updateClock();