
const User = require('../api/models/User');
const Link = require('../api/models/Link');
const Referral = require('../api/models/Referral');

module.exports = {
    sampleData: {
        referrer: { name: 'Referrer User', email: 'referrer@example.com', password: 'password' },
        referee: { name: 'Referee User', email: 'referee@example.com', password: 'password' },
    },
    cleanTestData: async (referrerEmail, refereeEmail) => {
        // find referrer user
        const referrerUser = await User.findOne({ email: referrerEmail });

        if (referrerUser) {
            // find and delete all referrals of referrer user
            const referrerLinks = await Link.find({ user: referrerUser._id });
            for (let i = 0; i < referrerLinks.length; i++) {
                await Referral.deleteMany({ link: referrerLinks[i]._id });
            }

            // delete all links of referrer user
            await Link.deleteMany({ user: referrerUser._id });

            // delete referrer user
            await User.deleteOne({ email: referrerEmail });
        }

        // delete referee user
        await User.deleteOne({ email: refereeEmail });
    },
};
