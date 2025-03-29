import { responseMessages } from "@/constants/constant"

class ResponseWrapper {

    private messages: typeof responseMessages;

    constructor() {
        this.messages = responseMessages;
    }

    response(status: number, message?: string, data?: any) {
        if(status >= 200 && status < 300) {
            return this.success(status, message, data);
        } else if(status >= 400 && status < 500) {
            return this.fail(status, message, data);
        } else if(status >= 500) {
            return this.error(status, message, data);
        } else {
            return {status, message, data};
        }
    }

    success(status?: number, message?: string, data?: any) {
        return {
            status: status || 200,
            message: message || this.messages.success,
            data: data || null,
        }
    }

    fail(status? : number, message?: string, data?: any) {
        return {
            status: status || 400,
            message: message || this.messages.fail,
            data: data || null,
        }
    }

    error(status? : number, message?: string, data?: any) {
        return {
            status: status || 500,
            message: message || this.messages.error,
            data: data || null,
        }
    }
}

export default ResponseWrapper;