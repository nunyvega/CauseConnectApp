# CauseConnect

## Introduction
CauseConnect is a web application designed to strengthen connections within members of non-profit organizations. It offers a simple platform to view and engage with members of an association. Users can easily manage their social preferences, create profiles, and explore the connections within their community.

## Features
- **Simple Login System:** Secure authentication for user access.
- **Homepage:** Displays the members met and provides calls to action to meet more members, view met members, and update met members.
- **User Profile:** Customize and manage personal preferences, hobbies, and greeting styles.
- **Member Profiles:** View the social preferences and profiles of other members.
- **User Preferences and Profile Management:** Users can update their preferences, upload a profile picture, and view their own profile as well as the profiles of other members.
- **Connection Management:** Users can mark other members as met or unmet, view all members grouped by the first letter of their name, view members they have met, and get user connection recommendations.
- **Authentication:** Secure user registration and login system.
- **API Endpoints:** Retrieve all users or a specific user by their username.
- **Homepage Statistics:** View statistics on user connections, such as the percentage of users met.
- **Database Seeding:** Populate the database with user data using a seed script.

## Technology Used
CauseConnect is built with the following technologies:
- **Express:** Web application framework for Node.js.
- **EJS:** Embedded JavaScript templating.
- **Mongoose:** Elegant MongoDB object modeling.
- **Passport:** Authentication middleware for Node.js.
- **Bcrypt:** Password hashing.
- **Nodemon:** Utility to monitor changes in the codebase and automatically restart the server.

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

4. **Start the Application:**
   For development:
   ```bash
   npm run dev
   ```
   For production:
   ```bash
   npm start
   ```

5. **Open a Browser:**
   Navigate to `http://localhost:3000` or the port specified in your configuration.

## Contributing
Feel free to contribute to CauseConnect by submitting pull requests or creating issues for bug reports and feature requests.

## License
ISC

## Author
Alvaro Vega / [@nunyvega](https://github.com/nunyvega)
