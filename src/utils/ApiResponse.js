
class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
export { ApiResponse }



/*
Purpose: To standardize the structure of API responses.

Explanation: When your application sends a response to a client (like a web browser or 
a mobile app), you want the responses to have a consistent format. ApiResponse ensures 
that every response includes a statusCode, data, message, and a success flag indicating 
if the operation was successful.

Analogy: Think of ApiResponse as a template for a letter you send out. Every letter needs 
to include the date, recipient's name, the body of the message, and a signature. This class
ensures that every "letter" (response) from your server looks professional and consistent.
*/