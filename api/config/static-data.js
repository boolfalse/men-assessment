
module.exports = {
    testSecretKey: process.env.SECRET_KEY || 'SecretKeyForEncryption',
    user_password: {
        min_length: 6,
        max_length: 30,
        salt_rounds: 10,
    },
    user_name: {
        min_length: 2,
        max_length: 50,
    },
    referral_key_length: 8,
    pagination: {
        per_default: 5,
        per_max: 10,
    },
    seeds: {
        users: [
            {
                isAdmin: true,
                name: 'Admin',
                email: 'admin@example.com',
                plain_password: 'password',
            },
        ],
    },
};
