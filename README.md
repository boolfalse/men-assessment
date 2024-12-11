
## MEN stack assessment




#### About:

MongoDB + Express.js + Node.js assessment project.




### Table of Contents

- [Resources](#resources)
- [Installation Steps](#installation_steps)
- [Run with Docker](#run_with_docker)
- [Run Tests with Docker](#run_tests_with_docker)
- [Run Locally (without Docker)](#run_without_docker)
- [Run Tests Locally (without Docker)](#run_tests_without_docker)
- [Manual testing using `curl`](#manual_testing)
- [Test Results Snapshot](#test_results_snapshot)




<a name="resources"></a>

#### Resources:

API-endpoints overview on [Postman](https://documenter.getpostman.com/view/1747137/2sAYHwHPzM)

- Clone the repository:
```bash
git clone https://github.com/boolfalse/men-assessment.git && cd men-assessment
```




<a name="installation_steps"></a>

#### Installation Steps:

- Install dependencies:
```bash
npm install
```

- Setup `.env` file as mentioned in `.env.example` file.


- You can skip this if you're planning to run the application in a Docker container. Otherwise, create a database cluster on [MongoDB Atlas](https://cloud.mongodb.com/), get the connection string and set `MONGO_URI` variable in `.env` file as mentioned in `.env.example` file:
```dotenv
# Use this when connecting to MongoDB Atlas
MONGO_URI=mongodb+srv://<MONGO_USER>:<MONGO_PASS>@<MONGO_HOST>/?retryWrites=true&w=majority
```




<a name="run_with_docker"></a>

#### Run with Docker:

- Build the image:
```bash
docker-compose build
```

- This will run the application on port 3000 by default. `DB_SEED=true` is for seeding an admin user in the database. Run the container (`-d` for detached mode):
```bash
DB_SEED=true docker-compose up -d
```

- If you want to run the application without seeding the database, just use without `DB_SEED` command:
```bash
docker-compose up -d
```

- **Optional:** Use this command to run on a different port (3001 is in the example).
```bash
HOST_PORT=3001 docker-compose up -d
```

- **Optional:** Check the application (for default port 3000):
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




<a name="run_tests_with_docker"></a>

#### Run Tests with Docker:

- Make sure you've built the image as mentioned in the [Run with Docker](#run_with_docker) section.


- Run tests within a Docker container from the host machine.
  This will run the application in the test environment and execute the tests.
```bash
docker-compose run app npm run test
```




<a name="run_without_docker"></a>

#### Run Locally (without Docker):

- Make sure you have the following installed on your system:
  - Node.js (v18 or higher) with npm
  - MongoDB (v4.4 or higher)
  - Postman (for manual testing)
  - cURL (for manual testing)


- Run the application. `db:seed` is an optional command to seed admin user in the database.
```bash
npm run start db:seed
```

- Run the application (development):
```bash
npm run dev
```




<a name="run_tests_without_docker"></a>

#### Run Tests Locally (without Docker):

- Run tests (this will set `NODE_ENV=development` and run the tests). `db:seed` is an optional command to seed admin user in the database.
```bash
npm run test db:seed
```




<a name="manual_testing"></a>

#### Manual testing using `curl`:

Use below `curl` commands in your CLI step-by-step to test the API endpoints manually.

**NOTES**: Before running the commands, make sure to:
- Check Postman documentation for the API-endpoints overview mentioned in the [Resources](#resources) section.
- Modify `name`, `email`, `password`, and `referral_key` values as per your choice.
- Replace `<BEARER_TOKEN>` with the actual token received from the login response.
- Replace `1234abcd` with the actual referral key received from the **Create Link** response.
- Replace URL port `3000` with the actual port if the application is running on a different port.

<details>
  <summary>Root URL</summary>

- Test the root URL:
```bash
curl --location 'http://localhost:3000/api'
```
</details>

<details>
  <summary>Register as Referrer</summary>

- Register a new user (`referral_key` not provided):
```bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Referrer1' \
--data-urlencode 'email=referrer1@example.com' \
--data-urlencode 'password=password' \
--data-urlencode 'referral_key='
```
</details>

<details>
  <summary>Login</summary>

- Login with the registered user:
```bash
curl --location 'http://localhost:3000/api/users/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=referrer1@example.com' \
--data-urlencode 'password=password'
```
</details>

<details>
  <summary>User Profile</summary>

- Get the profile of the authenticated user:
```bash
curl --location 'http://localhost:3000/api/users/profile' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```
</details>

<details>
  <summary>Create Link (referral)</summary>

- Create a referral link:
```bash
curl --location --request POST 'http://localhost:3000/api/links' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```
</details>

<details>
  <summary>Get Links (referrals)</summary>

- Get the referral links created by the referrer:
```bash
curl --location 'http://localhost:3000/api/links' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```
</details>

<details>
  <summary>Register a Referee</summary>

- Register a new user using the referral key (`referral_key` provided):
```bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>' \
--data-urlencode 'name=Referee1' \
--data-urlencode 'email=referee1@example.com' \
--data-urlencode 'password=password' \
--data-urlencode 'referral_key=1234abcd'
```
</details>

<details>
  <summary>Get Referral Data</summary>

- Get the count of referrals registered for a single link (referral):
```bash
curl --location 'http://localhost:3000/api/links/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```
</details>




<a name="test_results_snapshot"></a>

#### Test Results Snapshot:

Test results example (taken from the local running application without Docker):
```text
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
