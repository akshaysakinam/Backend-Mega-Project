import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";


const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`)

    }
    catch (error) {
        console.log("MONGODB connection error  ", error)
        process.exit(1)
    }
}

export default connectDB;
















/*
Explanantion of code in detail
Given the `MONGODB_URI` and `DB_NAME` values you provided, let's break down how they are used in your connection string and what each part represents.

### Provided Values

1. **MONGODB_URI**
   ```plaintext
   mongodb+srv://Akshay:Akshay123@cluster0.g8zijcy.mongodb.net
   ```
   This URI is for a MongoDB deployment using the SRV connection string format. Here's a breakdown:
   - `mongodb+srv://` specifies the use of the SRV connection format, which simplifies connecting to a MongoDB Atlas cluster.
   - `Akshay:Akshay123` are the username and password for authentication.
   - `cluster0.g8zijcy.mongodb.net` is the host, which points to the MongoDB Atlas cluster.

2. **DB_NAME**
   ```javascript
   export const DB_NAME = "youtube";
   ```
   This specifies the name of the database to connect to within the MongoDB cluster.

### Complete Connection String

The complete connection string used in your code will be:
```javascript
const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
```
When you substitute the environment variable and constant, it becomes:
```javascript
const connectionInstance = await mongoose.connect("mongodb+srv://Akshay:Akshay123@cluster0.g8zijcy.mongodb.net/youtube");
```

### Components of the Connection String

- **mongodb+srv://**: Indicates the use of the SRV connection format.
- **Akshay:Akshay123**: The credentials (username and password).
- **cluster0.g8zijcy.mongodb.net**: The host, which is the address of your MongoDB Atlas cluster.
*/

//- **/youtube**: The name of the database you are connecting to, specified by `DB_NAME`.
/*
### Usage in Code

Here's how these values fit into your code:
```javascript
import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error  ", error);
        process.exit(1);
    }
}

export default connectDB;
```

### Explanation of `connectionInstance`

- **connectionInstance**: The result of the `mongoose.connect` call, which returns a promise that resolves to a Mongoose connection object.
  - **connectionInstance.connection.host**: This logs the host part of the connection, which in this case would be `cluster0.g8zijcy.mongodb.net`.

### Example Output

When you successfully connect to the database, you should see output similar to:
```plaintext
MONGODB connected !! DB HOST: cluster0.g8zijcy.mongodb.net
```

This confirms that the connection to the MongoDB Atlas cluster was successful and identifies the host of the connected cluster.
*/