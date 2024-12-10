
## MEN stack assessment



#### About:

MongoDB + Express.js + Node.js assessment project.



#### Resources:

API-endpoints overview on [Postman](https://documenter.getpostman.com/view/1747137/2sAYHwHPzM)



#### Install Locally:

- Clone the repository:
```bash
git clone https://github.com/boolfalse/men-assessment.git && cd men-assessment
```

- Install dependencies:
```bash
npm install
```

- Setup `.env` file as mentioned in `.env.example` file.

- Create a database cluster on MongoDB Atlas. Get the connection string and set **MONGO_URI** variable in `.env` file.

- Run the application (production):
```bash
npm run start
```

- Run the application (development):
```bash
npm run dev
```



#### Run Tests:

- Run tests (this will work with `NODE_ENV=development`):
```bash
npm run test
```

Test results example:
```text
API server listening on port 3000...

MongoDB host: cluster0-shard-00-00.mzcsh.mongodb.net
MongoDB connected...
  API Endpoints
    √ Should return success message for root URL (39ms)
    √ Should return registered referrer data (744ms)
    √ Should return logged in user data (432ms)
    √ Should return authorized user profile (291ms)
    √ Should return created referral link (580ms)
    √ Should return registered referee data (707ms)
    √ Should return referral links created by user (566ms)
    √ Should return referral data (count of referrals registered) (882ms)

  8 passing (9s)
```

#### Author:

- [Website](https://boolfalse.com)
- [LinkedIn](https://www.linkedin.com/in/boolfalse/)
