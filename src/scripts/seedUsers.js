const mongoose = require('mongoose');
const faker = require('faker');
const User = require("../models/User");
const bcrypt = require('bcrypt');
const hashedPass = bcrypt.hashSync('admin', 10);

mongoose.connect('mongodb://localhost/CauseConnect', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    generateUsers(10); // Generate 100 users, for example.
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
});

User.deleteMany({ username: { $ne: 'admin' } }).then(() => {
    console.log('Deleted all users except for admin.');
}).catch(err => {
    console.error('Failed to delete users:', err);
});


function generateUsers(numberOfUsers) {
    const users = [];

    for (let i = 0; i < numberOfUsers; i++) {
        users.push(new User({
            username: faker.internet.userName(),
            password: hashedPass,
            name: faker.name.findName(),
            age: faker.datatype.number({ min: 18, max: 80 }), // Updated from faker.random.number to faker.datatype.number
            skills: [faker.random.arrayElement(User.schema.path('skills').caster.enumValues)],
            interests: [faker.random.arrayElement(User.schema.path('interests').caster.enumValues)],
            role: [faker.random.arrayElement(User.schema.path('role').caster.enumValues)],
            favoriteBook: faker.random.arrayElement(["The Great Gatsby", "Moby Dick", "To Kill a Mockingbird"]),
            preferredGreeting: faker.random.arrayElement(User.schema.path('preferredGreeting').enumValues),
            // Use unsplash dynamic image generator, faker does 
            profilePicture: i % 2 === 0 ? 'https://randomuser.me/api/portraits/men/' + i + '.jpg' : 'https://randomuser.me/api/portraits/women/' + i + '.jpg', 
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
