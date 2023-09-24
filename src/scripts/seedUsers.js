const mongoose = require('mongoose');
const faker = require('faker');
const User = require("../models/User");
const Connection = require("../models/Connection");
const bcrypt = require('bcrypt');
require('dotenv').config();

// Use the same password for every user to test the app faster
const hashedPass = bcrypt.hashSync('admin', 10);

// Connect to MongoDB and seed data
const mongoUri = process.env.MONGODB_URI;
const mongoLocalUri = "mongodb://localhost/CauseConnect";

mongoose.connect(mongoLocalUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    return clearCollections(); // Call function to clear Users and Connections
})
.then(() => {
    console.log('Deleted all users except for admin.');
    return generateUsers(78); // Generate 78 users
})
.then(generateConnectionsForAdmin)
.catch(err => {
    console.error('Error:', err);
    mongoose.connection.close();
});

// Clear User and Connection collections
function clearCollections() {
    return User.deleteMany({}).then(() => {
        console.log('All documents in the User collection have been deleted.');
        return Connection.deleteMany({});
    }).then(() => {
        console.log('All documents in the Connection collection have been deleted.');
    });
}

/**
 * Generate random items for user attributes
 */
function generateRandomItems(path, min, max) {
    let itemsCount = faker.datatype.number({ min: min, max: max });
    let items = [];

    while (items.length < itemsCount) {
        const newItem = faker.random.arrayElement(User.schema.path(path).caster.enumValues);
        // Make sure the item is not already in the array
        if (!items.includes(newItem)) {
            items.push(newItem);
        }
    }
    return items;
}

/**
 * Generate user data and save to the database
 */
function generateUsers(numberOfUsers) {
    const users = [];

    for (let i = 0; i < numberOfUsers; i++) {
        let username = faker.internet.userName();

        users.push(new User({
            username: username,
            password: hashedPass,
            name: faker.name.findName(),
            age: faker.datatype.number({ min: 18, max: 80 }),
            skills: generateRandomItems('skills', 7, 14),
            interests: generateRandomItems('interests', 6, 14),
            roles: generateRandomItems('roles', 3, 6),
            favoriteBook: faker.random.arrayElement(["The Great Gatsby", "Moby Dick", "To Kill a Mockingbird"]),
            preferredGreeting: generateRandomItems('preferredGreeting', 1, 5),
            profilePicture: i % 2 === 0 ? 'https://randomuser.me/api/portraits/men/' + i + '.jpg' : 'https://randomuser.me/api/portraits/women/' + i + '.jpg',
            languagesSpoken: generateRandomItems('languagesSpoken', 1, 4),
            personalBio: faker.lorem.paragraphs(3),
            location: faker.address.city(),
            contactMethods: {
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
            },
            personalBlogOrWebsite: faker.internet.url(),
            socialMedia: {
                facebook: 'https://facebook.com/' + username,
                twitter: 'https://twitter.com/' + username,
                instagram: 'https://instagram.com/' + username,
                linkedin: 'https://linkedin.com/' + username,
                youtube: 'https://youtube.com/' + username,
                website: faker.internet.url(),
            }
        }));
    }

    // Add admin users
    users.push(createAdminUser('admin'));
    users.push(createAdminUser('admin2')); // Add a second admin user

    return User.insertMany(users).then(docs => {
        console.log(`Inserted ${docs.length} users.`);
    });
}

/**
 * Helper function to create an admin user
 */
function createAdminUser(username) {
    return new User({
        username: username,
        isAdmin: true,
        password: hashedPass,
        name: faker.name.findName(),
        age: faker.datatype.number({ min: 18, max: 80 }),
        skills: generateRandomItems('skills', 7, 14),
        interests: generateRandomItems('interests', 6, 14),
        roles: generateRandomItems('roles', 3, 6),
        favoriteBook: faker.random.arrayElement(["The Great Gatsby", "Moby Dick", "To Kill a Mockingbird"]),
        preferredGreeting: generateRandomItems('preferredGreeting', 1, 5),
        profilePicture: 'https://randomuser.me/api/portraits/men/90.jpg',
        languagesSpoken: generateRandomItems('languagesSpoken', 1, 4),
        personalBio: faker.lorem.paragraphs(3),
        location: faker.address.city(),
        contactMethods: {
            email: faker.internet.email(),
            phone: faker.phone.phoneNumber(),
        },
        personalBlogOrWebsite: faker.internet.url(),
        socialMedia: {
            facebook: 'https://facebook.com/' + username,
            twitter: 'https://twitter.com/' + username,
            instagram: 'https://instagram.com/' + username,
            linkedin: 'https://linkedin.com/' + username,
            youtube: 'https://youtube.com/' + username,
            website: faker.internet.url(),
        }
    });
}

/**
 * Generate connections for the admin users
 */
function generateConnectionsForAdmin() {
    return User.find({ username: { $in: ['admin', 'admin2'] } }).then(adminUsers => {
        const adminIds = adminUsers.map(user => user._id);
        return Promise.all(adminIds.map(adminId => createConnectionsUsingAdminId(adminId)));
    });
}

/**
 * Create connections using the admin user's ID
 */
function createConnectionsUsingAdminId(adminId) {
    return User.aggregate([
        { $match: { _id: { $ne: adminId } } },
        { $sample: { size: 43 } }
    ]).then(users => {
        const connections = users.map(user => ({
            user1: adminId,
            user2: user._id,
            metDate: new Date()  // Set metDate to the current date/time
        }));

        return Connection.insertMany(connections).then(docs => {
            console.log(`Created ${docs.length} connections for the admin user.`);
            mongoose.connection.close();
        });
    });
}
