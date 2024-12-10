
## MEN stack assessment



#### About:

MongoDB + Express.js + Node.js assessment project.



#### Resources:

API-endpoints overview on [Postman](https://documenter.getpostman.com/view/1747137/2sAYHwHPzM)

- Clone the repository:
```bash
git clone https://github.com/boolfalse/men-assessment.git && cd men-assessment
```



#### Installation Steps:

- Install dependencies:
```bash
npm install
```

- Setup `.env` file as mentioned in `.env.example` file.

- Create a database cluster on MongoDB Atlas. Get the connection string and set `MONGO_URI` variable in `.env` file.




#### Run Locally:

- Run the application (production):
```bash
npm run start
```

- Run the application (development):
```bash
npm run dev
```



#### Run with Docker:

- Build the image:
```bash
docker-compose build
```

- Run the container (`-d` for detached mode). This will run the application on port 3000 by default.
```bash
docker-compose up -d
```

- Use this command to run on a different port (3001 in the example).
```bash
HOST_PORT=3001 docker-compose up -d
```

- Access the application (for default port 3000):
```bash
curl http://localhost:3000/api
```

- For stopping the running containers in detached mode:
```bash
# stop them by using the service names
docker stop men_assessment_app men_assessment_mongo

# or by identifying their container IDs and stopping them
docker ps
docker stop <app_id> <mongo_id>
```



#### Run Tests:

- Run tests (this supposed to work for `NODE_ENV=development`):
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
