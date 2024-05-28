import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        emai: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullname: {
            type: String,
            required: true,
            trim: true,
            index: true
        },
        avatar: {
            type: String, //cloudinary url
            required: true,
        },
        coverImage: {
            type: String, //cloudinary url

        },
        watchHistory: [{
            type: Schema.Types.ObjectId,
            ref: "Video"
        }],
        password: {
            type: String,
            required: [true, "Password is required"],

        },
        refreshToken: {
            type: String,

        }


    }, {
    timestamps: true
}
)
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) //compare the password with the hashed password
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            emai: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User", userSchema)









/*
Q:The generateAccessToken method generates an access token for a user, 
signing it with the secret and setting the expiry as defined in your .env file.                                                       I already gave ACCESS_TOKEN_SECRET in my  .env then why we need to generate again in user.mode.js



The `ACCESS_TOKEN_SECRET` in your `.env` file and the `generateAccessToken` method in 
`user.model.js` serve complementary but distinct roles in your authentication process. 
Let's clarify why both are needed and how they work together.

### Role of `ACCESS_TOKEN_SECRET` in `.env`

The `ACCESS_TOKEN_SECRET` environment variable is a secret key used for signing JSON Web 
Tokens (JWTs). This key ensures that the tokens can be verified later to confirm their 
authenticity and integrity.

- **Definition in `.env`:**
  ```plaintext
  ACCESS_TOKEN_SECRET=3871ac16f598d359e4a634797ed8631ba0cecf7d515a1420d7e55304b7f0037e
  ```

### Role of `generateAccessToken` in `user.model.js`

The `generateAccessToken` method in your `user.model.js` is responsible for creating the 
actual access token. This method:
1. Uses the user's data to create the payload for the JWT.
2. Signs the JWT with the secret key defined in `ACCESS_TOKEN_SECRET`.
3. Sets the expiration time for the token using the `ACCESS_TOKEN_EXPIRY` variable from 
your `.env` file.

- **Method Implementation:**
  ```javascript
  userSchema.methods.generateAccessToken = function () {
      return jwt.sign(
          {
              _id: this._id,
              email: this.email,
              username: this.username,
              fullname: this.fullname
          },
          process.env.ACCESS_TOKEN_SECRET,  // Using the secret key from .env
          {
              expiresIn: process.env.ACCESS_TOKEN_EXPIRY  // Using the expiry duration 
              from .env
          }
      );
  };
  ```

### Why Both are Needed

1. **Environment Variable (`ACCESS_TOKEN_SECRET`)**:
   - The secret key (`ACCESS_TOKEN_SECRET`) in your `.env` file is a configuration value 
   that provides the secret for signing tokens. This keeps your key centralized and easy 
   to manage. By storing it in the `.env` file, you can keep it secure and separate from 
   your codebase.
   
2. **Token Generation Method (`generateAccessToken`)**:
   - The `generateAccessToken` method uses the secret key to sign tokens specific to 
   individual users. This method is where the actual creation of the token happens, 
   embedding the user's information and setting the expiration time.

### How They Work Together

1. **Configuration and Security**:
   - `ACCESS_TOKEN_SECRET` in the `.env` file is securely loaded into your application 
   using `dotenv` and ensures that the key is not hardcoded in your source files. This 
   improves security by allowing you to keep sensitive information out of your codebase 
   and easily changeable without altering the code.

2. **Token Creation**:
   - When you need to create an access token for a user (e.g., when they log in), the 
   `generateAccessToken` method is called. This method creates a JWT that includes 
   user-specific data, signs it with the secret key (`ACCESS_TOKEN_SECRET`), and includes 
   an expiry time.

3. **Usage**:
   - The generated token is sent to the client, who uses it to authenticate future 
   requests. The server can verify the token using the same secret key to ensure the 
   token's integrity and authenticity.

### Example Flow

1. **User Logs In**:
   - The user provides their credentials (username and password).
   - The server verifies the credentials and, if valid, calls `generateAccessToken` 
   to create a JWT.

2. **Token Creation**:
   - `generateAccessToken` uses the user data and signs the token with 
   `ACCESS_TOKEN_SECRET`.
   - The token includes an expiry time (`ACCESS_TOKEN_EXPIRY`).

3. **Token Storage**:
   - The generated token is sent to the client (e.g., stored in a cookie or local storage).

4. **Subsequent Requests**:
   - The client includes the access token in the `Authorization` header for subsequent 
   requests.
   - The server verifies the token using the same `ACCESS_TOKEN_SECRET` to ensure it 
   hasn't been tampered with and is still valid.

By separating the secret key storage (in the `.env` file) and the token generation 
logic (in the `user.model.js`), you maintain a secure, flexible, and maintainable 
authentication system.
*/