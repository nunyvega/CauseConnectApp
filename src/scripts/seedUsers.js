const mongoose = require('mongoose');
const faker = require('faker');
const User = require("../models/User");

mongoose.connect('mongodb://localhost/CauseConnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    generateUsers(100); // Generate 100 users, for example.
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

function generateUsers(numberOfUsers) {
    const users = [];

    for (let i = 0; i < numberOfUsers; i++) {
        users.push(new User({
            username: faker.internet.userName(),
            password: faker.internet.password(),
            name: faker.name.findName(),
            age: faker.datatype.number({ min: 18, max: 80 }), // Updated from faker.random.number to faker.datatype.number
            skills: [faker.random.arrayElement(User.schema.path('skills').caster.enumValues)],
            interests: [faker.random.arrayElement(User.schema.path('interests').caster.enumValues)],
            role: [faker.random.arrayElement(User.schema.path('role').caster.enumValues)],
            favoriteBook: faker.random.arrayElement(["The Great Gatsby", "Moby Dick", "To Kill a Mockingbird"]),
            preferredGreeting: faker.random.arrayElement(User.schema.path('preferredGreeting').enumValues),
            profilePicture: 'https://source.unsplash.com/300x300/?profile-picture',
            languagesSpoken: [faker.random.arrayElement(User.schema.path('languagesSpoken').caster.enumValues)],
            personalBio: faker.lorem.paragraph(),
            location: faker.address.city(),
            contactMethods: {
                email: faker.internet.email(),
                phone: faker.phone.phoneNumber(),
            },
            personalBlogOrWebsite: faker.internet.url()
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
