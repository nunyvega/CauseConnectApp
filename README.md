# CauseConnect

## Introduction
CauseConnect is a web application designed to strengthen connections within members of non-profit organizations. It offers a simple platform to view and engage with members of an association. Users can easily manage their social preferences, create profiles, and explore the connections within their community.

## Features
- **Simple Login System:** Secure authentication for user access.
- **Homepage:** Displays the main actions and statitstics for the user.
- **Recommendation algorithm:** Recommends users to connect with based on their social preferences and similarity score.
- **User Profile:** Customize and manage personal preferences, interests, greeting styles.
- **Member Profiles:** View the social preferences and profiles of other members.
- **User Preferences and Profile Management:** Users can update their preferences, upload a profile picture, and view their own profile as well as the profiles of other members.
- **Connection Management:** Users can mark other members as met or unmet, view all members grouped by the first letter of their name, view members they have met, and get user connection recommendations.
- **Authentication:** Secure user registration and login system.
- **API Endpoints:** Retrieve users and connections information from the database.
- **Homepage Statistics:** View statistics on user connections, such as the percentage of users met.
- **Database Seeding:** Populate the database with user data using a seed script.

## Technology Stack
CauseConnect is built with the following technologies:

- **Backend:**
  - **Express:** Web app framework for Node.js.
  - **Mongoose:** Elegant MongoDB object modeling.
  - **Passport:** Authentication middleware for Node.js.
  - **Bcrypt:** Password hashing.

- **Frontend:**
  - **EJS:** Embedded JavaScript templating.

- **Utilities:**
  - **Nodemon:** Used to monitor changes in the code and automatically restart the server.
  - **Multer:** Used to upload profile images.
  - **Dotenv:** Used for environment variables from the `.env` file (MongoDB URI).
  - **Faker:** Generate fake data for the users.
  - **Connect-flash:** Flash message middleware for Express.

- **Testing:**
  - **Mocha:** JavaScript test framework.
  - **Chai:** Assertion library for Node.js and browsers.
  - **Chai-http:** HTTP integration testing with Chai assertions.

## How to Run
Follow these steps to run CauseConnect locally:

1. **Clone the Repository:** 
   ```bash
   git clone https://github.com/nunyvega/CauseConnectApp.git
   ```

2. **Navigate to the Directory:**
   ```bash
   cd cause-connect
   ```

3. **Install Dependencies:**
   ```bash
   npm install
   ```

4. **Populate the Database with user data:**
   ```bash
   npm run seed
   ```

5. **Start the Application:**
   For development:
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

6. **Open a Browser:**<br>
   Navigate to `http://localhost:3000` or the port specified in your configuration.

<br>

7. **Change form MongoDB Atlas to local instance** (optional):<br>
   The app will use the MongoDB database in MongoDB Atlas (cloud database service) by default. If you want to use a local database, you can change the MongoDB URI in the `.env` file, or simply checkout to the `use-local-DB-instead-of-mongodb-Atlas` branch
   ```
   git checkout use-local-DB-instead-of-mongodb-Atlas
   ```
   
<br>

## Testing
CauseConnect uses Mocha as its test framework, complemented by Chai for assertions and Chai-http for HTTP integration testing. To run the tests, follow these steps:

1. **Ensure Dependencies are Installed and user data exists:**
   If you haven't already, make sure to install all the necessary dependencies:
   ```bash
   npm install && npm run seed
   ```
2. **Run the Tests:**
   ```bash
   npm test
   ```
   This will run all the tests in the `test` directory.

## Contributing
Feel free to contribute to CauseConnect by submitting pull requests or creating issues for bug reports and feature requests.

## License
ISC

## Author
Alvaro Vega / [@nunyvega](https://github.com/nunyvega)
