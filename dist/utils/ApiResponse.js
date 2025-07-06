class ApiResponse {
    constructor(success = true, status = 400, message, data) {
        this.success = success;
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
export default ApiResponse;
