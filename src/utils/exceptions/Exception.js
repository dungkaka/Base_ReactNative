class Exception extends Error {
    constructor(code = 100, message = "Error", raw) {
        super(message);
        this.status = false;
        this.code = code;
        this.message = message;
        this.raw = raw;
    }
}

export default Exception;
