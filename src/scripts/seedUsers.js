const mongoose = require('mongoose');
const faker = require('faker');
const User = require("../models/User");
const bcrypt = require('bcrypt');

// Use the same password for every use to test the app faster
const hashedPass = bcrypt.hashSync('admin', 10);

mongoose.connect('mongodb://localhost/CauseConnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    generateUsers(100); // Generate 100 users, for example.
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

User.deleteMany({ username: { $ne: 'admin' } }).then(() => {
    console.log('Deleted all users except for admin.');
}).catch(err => {
    console.error('Failed to delete users:', err);
});


// Randomly generate a number of values for fields with enum values
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
            languagesSpoken: generateRandomItems('languagesSpoken', 2, 6),
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

    // Save all users to the database
    User.insertMany(users).then(docs => {
        console.log(`Inserted ${docs.length} users.`);
        mongoose.connection.close();
    }).catch(err => {
        console.error('Failed to insert users:', err);
    });
}

