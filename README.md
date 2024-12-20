
## MEN stack assessment




### About:

MongoDB + Express.js + Node.js assessment project.




### Table of Contents

- [Features:](#features)
- [Resources](#resources)
- [Installation Steps](#installation_steps)
- [List of Commands](#list_of_commands)
- [Run with Docker](#run_with_docker)
- [Run Tests with Docker](#run_tests_with_docker)
- [Run Locally (without Docker)](#run_without_docker)
- [Run Tests Locally (without Docker)](#run_tests_without_docker)
- [Request Examples with `curl`](#curl_request_examples)
  - [Root URL](#root_url)
  - [Register as Referrer](#register_as_referrer)
  - [Login (as regular user)](#login_as_regular_user)
  - [User Profile](#user_profile)
  - [Create Link (referral)](#create_link_referral)
  - [Get Links (referrals)](#get_links_referrals)
  - [Register a Referee](#register_a_referee)
  - [Get Referral Data](#get_referral_data)
  - [Login (as admin)](#login_as_admin)
  - [Get Users (as admin)](#get_users_as_admin)
- [Credentials for Manual Testing](#manual_testing_credentials)
- [Author](#author)




<a name="features"></a>

### Features:

- User (referrer/referee) authentication via **JWT** and **password hashing**.
- **Referral link creation** and registration of referees.
- **Session/Cookie-based authentication** for admin.
- Listing users with **pagination** and **search** functionality for admin.
- Middlewares for authentication and **validation** (express-validator).
- Containerized application with **Docker**.
- Automated tests for regular users (non-admin) using: **Jest** (on [`master`](https://github.com/boolfalse/men-assessment/tree/master) branch).
- Automated tests for regular users (non-admin) using: **Mocha**, **Chai**, **Supertest** (on [`tests_mocha`](https://github.com/boolfalse/men-assessment/tree/tests_mocha) branch).
- API Documentation with **Postman**.
- _More features can be added in the future._




<a name="resources"></a>

### Resources:

- API-endpoints overview on [Postman](https://documenter.getpostman.com/view/1747137/2sAYHwHPzM)


- GitHub [Repository](https://github.com/boolfalse/men-assessment):
```bash
git clone https://github.com/boolfalse/men-assessment.git && cd men-assessment
```




<a name="installation_steps"></a>

### Installation Steps:

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




<a name="list_of_commands"></a>

### List of Commands:

> **NOTE:** for detailed information, read the appropriate sections below.

Below is the list of commands available to run the application and tests.


<details>
  <summary>
    <strong>Work with Docker (click to expand/collapse)</strong>
  </summary>

- Before running with Docker, make sure to build the image:
  ```bash
  docker-compose build
  ```

- Run the application with Docker (short version without detached mode):
  ```bash
  docker-compose up
  ```

- Run the application with Docker (with seeding):
  ```bash
  DB_SEED=true docker-compose up
  ```

- Run unit tests with Docker:
  ```bash
  docker-compose run app npm run test:unit
  ```

- Run integration (end-to-end) tests with Docker:
  ```bash
  docker-compose run app npm run test:e2e
  ```

- Run all tests (unit and integration) with Docker:
  ```bash
  docker-compose run app npm run test
  ```

</details>


<details>
  <summary>
    <strong>Work in local / host machine (click to expand/collapse)</strong>
  </summary>

- Run the application locally:
  ```bash
  npm run start
  ```

- Run the application locally (with seeding):
  ```bash
  npm run start db:seed
  ```

- Run unit tests locally:
  ```bash
  npm run test:unit
  ```

- Run integration (end-to-end) tests locally:
  ```bash
  npm run test:e2e
  ```

- Run all tests (unit and integration) locally:
  ```bash
  npm run test
  ```

</details>




<a name="run_with_docker"></a>

### Run with Docker:

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

### Run Tests with Docker:

> **NOTE:** At this time test are written for the regular users (non-admin) only as per the assessment requirements. However, you can test admin endpoints manually using Postman or cURL.

- Before running tests with Docker, make sure you've built the image as it's mentioned in the [Run with Docker](#run_with_docker) section:
```bash
docker-compose build
```

Below commands will set `NODE_ENV=development` and run the tests.

- Run unit tests within a Docker container from the host machine.
```bash
docker-compose run app npm run test:unit
```

- Run integration (end-to-end) tests within a Docker container from the host machine.
```bash
docker-compose run app npm run test:e2e
```

- Run all tests (unit and integration) within a Docker container from the host machine.
  This command will run unit tests first and then integration (e2e) tests.
```bash
docker-compose run app npm run test
```




<a name="run_without_docker"></a>

### Run Locally (without Docker):

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

### Run Tests Locally (without Docker):

> **NOTE:** At this time test are written for the regular users (non-admin) only as per the assessment requirements. However, you can test admin endpoints manually using Postman or cURL.

Below commands will set `NODE_ENV=development` and run the tests.

- Run unit tests.
```bash
npm run test:unit
```

- Run integration (end-to-end) tests within a Docker container from the host machine.
```bash
npm run test:e2e
```

- Run all tests (unit and integration).
  This command will run unit tests first and then integration (e2e) tests.
```bash
npm run test
```




<a name="curl_request_examples"></a>

### Request Examples with `curl`:

Use below `curl` commands in your CLI step-by-step to test the API endpoints manually.

**NOTES**: Before running the commands, make sure to:
- Check Postman documentation for the API-endpoints overview mentioned in the [Resources](#resources) section.
- Modify `name`, `email`, `password`, and `referral_key` values as per your choice.
- Replace `<BEARER_TOKEN>` with the actual token received from the login response.
- Replace `1234abcd` with the actual referral key received from the **Create Link** response.
- Replace URL port `3000` with the actual port if the application is running on a different port.


<a name="root_url"></a>

#### Root URL

Test the root URL:
```bash
curl --location 'http://localhost:3000/api'
```


<a name="register_as_referrer"></a>

#### Register as Referrer

Register a new user (`referral_key` not provided):

`name`: Referrer, `email`: referrer@example.com, `password`: password
```bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Referrer' \
--data-urlencode 'email=referrer@example.com' \
--data-urlencode 'password=password' \
--data-urlencode 'referral_key='
```


<a name="login_as_regular_user"></a>

#### Login (as regular user)

Login as a regular user:

`email`: referrer@example.com, `password`: password
```bash
curl --location 'http://localhost:3000/api/users/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=referrer@example.com' \
--data-urlencode 'password=password'
```


<a name="user_profile"></a>

#### User Profile

Get the profile of the authenticated user:

`BEARER_TOKEN` is the token received from the login response.
```bash
curl --location 'http://localhost:3000/api/users/profile' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```


<a name="create_link_referral"></a>

#### Create Link (referral)

Create a referral link:

`BEARER_TOKEN` is the token received from the login response.
```bash
curl --location --request POST 'http://localhost:3000/api/links' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```


<a name="get_links_referrals"></a>

#### Get Links (referrals)

Get the referral links created by the referrer:

`BEARER_TOKEN` is the token received from the login response.
```bash
curl --location 'http://localhost:3000/api/links' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```


<a name="register_a_referee"></a>

#### Register a Referee

Register a new user using the referral key (`referral_key` provided):

`name`: Referee, `email`: referee@example.com, `password`: password, `referral_key`: 1234abcd, `BEARER_TOKEN` is the token received from the login response.
```bash
curl --location 'http://localhost:3000/api/users/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>' \
--data-urlencode 'name=Referee' \
--data-urlencode 'email=referee@example.com' \
--data-urlencode 'password=password' \
--data-urlencode 'referral_key=1234abcd'
```


<a name="get_referral_data"></a>

#### Get Referral Data

Get the count of referrals registered for a single link (referral):

`BEARER_TOKEN` is the token received from the login response.
```bash
curl --location 'http://localhost:3000/api/links/' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--header 'Authorization: Bearer <BEARER_TOKEN>'
```


<a name="login_as_admin"></a>

#### Login (as admin)

Login as an admin user:

`email`: admin@example.com, `password`: password
```bash
curl --location 'http://localhost:3000/api/admin/login' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'email=admin@example.com' \
--data-urlencode 'password=password'
```


<a name="get_users_as_admin"></a>

#### Get Users (as admin)

Get users with pagination:
`per` is the number of users per page and `page` is the page number. Maximum `per` value can be set to 10. Default `per` value is 5. Default `page` value is 1. `term` is the search term for filtering users by name or email. `term` is case-insensitive and can be 1-20 characters long.

`BEARER_TOKEN` is the token received from the admin login response. `per`: 2, `page`: 1, `term`: ReFeR
```bash
curl --location 'http://localhost:3000/api/admin/users?per=2&page=1&term=ReFeR' \
--header 'Cookie: admin_token=<BEARER_TOKEN>'
```




<a name="manual_testing_credentials"></a>

### Credentials for Manual Testing:

Below are admin user credentials for testing:
```text
email: admin@example.com
password: password
```

Below are regular user credentials for testing:
```text
# Referrer
email: referrer@example.com
password: password

# Referee
email: referee@example.com
password: password
```




<a name="author"></a>

### Author:

- [Website](https://boolfalse.com)
- [LinkedIn](https://www.linkedin.com/in/boolfalse/)
