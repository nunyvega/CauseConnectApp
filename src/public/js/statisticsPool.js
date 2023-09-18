// Separate file to store statistics for the statistics section of the home page
let statisticsPool = [
    { message: "Members who met more than 10 people this month saw a 50% increase in collaboration opportunities." },
    { message: "The most common interest among connected members this month is 'Environmental Conservation'." },
    { message: "Active members meet an average of 7 new people every month." },
    { message: "Over 80% of members feel more engaged in their projects after networking with peers." },
    { message: "This month, 'Elderly Care & Support' has climbed up to be among the top 5 interests." },
    { message: "Members who attend community events report a 30% increase in personal roject success rate." },
    { message: "Did you know? Thursdays are the most popular days for members to connect and collaborate." },
    { message: "Around 60% of new members found out about our community through word of mouth." },
    { message: "Engagement rates spike up by 40% during community challenges and contests." },
];


let randomIndex = Math.floor(Math.random() * statisticsPool.length);
let statisticToShow = statisticsPool[randomIndex];

module.exports = statisticToShow;
