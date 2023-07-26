const SECOND = 1000;
const MINUTE = SECOND * 60;

class Cache {
    constructor(init = {}) {
        this.data = init;
        this.timeouts = {};
        this.timeoutTime = 10;
    }

    includes(key) {
        return key in this.data;
    }

    get(key) {
        if (!this.includes(key)) return false;

        return this.data[key];
    }

    set(key, value, timeout = true, minutes = this.timeoutTime) {
        this.data[key] = value;
        
        if (timeout) {
            clearTimeout(this.timeouts[key]);
            this.timeouts[key] = setTimeout(() => {
                delete this.data[key];
                delete this.timeouts[key];
            }, MINUTE * minutes);
        }
    }

    RESET() {
        this.data = {};
        this.timeouts = {};
    }

    setTimeoutTime(time = 10) {
        if (!time) return;

        this.timeoutTime = time;
    }
}


module.exports = { Cache };