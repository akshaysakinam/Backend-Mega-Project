const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}




export { asyncHandler }




//Try catch approach
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     }
//     catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }



/*
Purpose: To handle asynchronous errors in your request handlers gracefully.

Explanation: When you write code that interacts with databases or performs other 
asynchronous operations, errors can occur. asyncHandler ensures that these errors 
are caught and passed to the next middleware for handling, rather than crashing your 
server.

Analogy: Imagine you're a chef in a kitchen. You have a helper (asyncHandler) who 
watches over your cooking process. If you accidentally drop something (an error occurs),
the helper catches it and alerts you, so you can handle it properly instead of making a 
mess.
*/