const mongoose = require('mongoose');
const faker = require('faker');
const User = require("../models/User");
const Connection = require("../models/Connection");
const bcrypt = require('bcrypt');

// Use the same password for every user to test the app faster
const hashedPass = bcrypt.hashSync('admin', 10);

mongoose.connect('mongodb://localhost/CauseConnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB');
    return User.deleteMany({ username: { $ne: 'admin2' } });
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

function generateRandomItems(path, min, max) {
    let itemsCount = faker.datatype.number({ min: min, max: max });
    let items = [];

    for (let i = 0; i < itemsCount; i++) {
        items.push(faker.random.arrayElement(User.schema.path(path).caster.enumValues));
    }
    return items;
}

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
                facebook: 'facebook.com/' + username,
                twitter: 'twitter.com/' + username,
                instagram: 'instagram.com/' + username,
                linkedin: 'linkedin.com/' + username,
                youtube: 'youtube.com/' + username,
                website: faker.internet.url(),
            }
        }));
    }

    users.push(new User({
        username: 'admin',
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
            facebook: 'facebook.com/admin',
            twitter: 'twitter.com/admin',
            instagram: 'instagram.com/admin',
            linkedin: 'linkedin.com/admin',
            youtube: 'youtube.com/admin',
            website: faker.internet.url(),
        }
    }));

    return User.insertMany(users).then(docs => {
        console.log(`Inserted ${docs.length} users.`);
    });
}

function generateConnectionsForAdmin() {
    return User.findOne({ username: 'admin' }).then(adminUser => {
        return createConnectionsUsingAdminId(adminUser._id);
    });
}

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
