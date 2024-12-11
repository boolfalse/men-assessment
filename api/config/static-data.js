
module.exports = {
    password_salt_rounds: 10,
    password_min_length: 6,
    password_max_length: 30,
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
