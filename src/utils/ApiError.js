class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors



        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }

    }
}

export { ApiError }


/*
Purpose: To create a custom error class for handling errors in your application.

Explanation: In JavaScript, errors are typically instances of the Error class.
The ApiError class extends this base class to add more specific details like statusCode,
message, errors, and stack.

Analogy: Imagine you run a customer service center. When a problem occurs, you need to
log the issue with specific details (like the type of problem, customer information, and
the steps leading up to the problem). The ApiError class is like a detailed problem
report form that includes all these specifics.
 */



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


/*
Yes, exactly! The `ApiError` class is designed to provide a structured and consistent 
way to handle and report errors in your application. This has several benefits, 
particularly for the users and developers who interact with your API. Let's break down 
the advantages and the process in a bit more detail.

### Advantages of Using `ApiError`

1. **Consistency**:
   - All errors are structured in the same way, making it easier for clients 
   (such as web or mobile applications) to understand and handle them appropriately.

2. **Clarity**:
   - By providing clear and specific error messages along with HTTP status codes, 
   users and developers can quickly understand what went wrong.
   - Additional details (like validation errors) can be included in the `errors` array, 
   providing more context.

3. **Debugging**:
   - Including stack traces and specific error details helps developers debug issues more 
   effectively.
   - The structured format ensures that all necessary information is captured and can 
   be logged or displayed.

### How `ApiError` Works

When an error occurs in your application, instead of throwing a generic error, you throw 
an instance of `ApiError` with specific details. Here's a step-by-step explanation of 
what happens:

1. **Error Occurrence**:
   - An error is detected in your application logic (e.g., a requested resource is not 
    found, or a validation fails).

2. **Throwing `ApiError`**:
   - You throw a new `ApiError` with relevant details such as the HTTP status code, error 
   message, and any additional errors.
   ```javascript
   throw new ApiError(404, "Resource not found", [{ field: "id", message: "Invalid ID" }]);
   ```

3. **Catching the Error**:
   - The error is caught by your error handling middleware in Express.js.
   ```javascript
   app.use((err, req, res, next) => {
       if (err instanceof ApiError) {
           res.status(err.statusCode).json({
               success: err.success,
               message: err.message,
               errors: err.errors
           });
       } else {
           res.status(500).json({
               success: false,
               message: "Internal Server Error"
           });
       }
   });
   ```

4. **Sending the Response**:
   - The middleware checks if the error is an instance of `ApiError`.
   - If it is, it sends a structured JSON response to the client with all the details.
   - If it is not an instance of `ApiError`, it sends a generic internal server error 
   response.

### Example Scenario

Imagine you have an API endpoint that retrieves user information by ID. Here's how you 
might use `ApiError`:

```javascript
import express from 'express';
import { ApiError } from './utils/ApiError.js';

const app = express();

// Mock database
const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" }
];

// Route to get user by ID
app.get('/user/:id', (req, res, next) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (!user) {
        // Throwing ApiError if user is not found
        throw new ApiError(404, "User not found", [{ field: "id", message: "Invalid user 
        ID" }]);
    }

    res.json(user);
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

### User Perspective

When a client makes a request to `/user/3` and the user with ID 3 does not exist:

1. **Without `ApiError`**:
   - The server might return a generic 500 error or an unstructured error message.
   - This can be confusing for the client as they won't know if it's a server issue or 
   if they provided incorrect input.

2. **With `ApiError`**:
   - The client receives a clear, structured JSON response:
     ```json
     {
         "success": false,
         "message": "User not found",
         "errors": [
             { "field": "id", "message": "Invalid user ID" }
         ]
     }
     ```
   - This tells the client exactly what went wrong (the user ID was invalid) and that 
   the request was not successful.

### Summary

By using `ApiError`, you're setting a clear structure for handling errors, ensuring that:
- Users receive understandable and consistent error messages.
- Developers have detailed information for debugging.
- The overall robustness and maintainability of your application are improved.
*/