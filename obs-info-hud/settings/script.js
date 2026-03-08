function updateClock() {
    const urlParams = new URLSearchParams(window.location.search);
    const keys = ['host', 'port', 'password'];
    const hasCustomParams = keys.some(key => urlParams.has(key));
}