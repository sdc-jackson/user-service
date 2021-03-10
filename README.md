# User Profile

> This repo is a clone of the User Profile service from an AirBnb room listing page.

## Related Projects

  - https://github.com/sdc-jackson/photos-service
  - https://github.com/sdc-jackson/user-service
  - https://github.com/sdc-jackson/availability-service

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Usage

> Some usage instructions

## Requirements

An `nvmrc` file is included if using [nvm](https://github.com/creationix/nvm).

- Node 6.13.0
- etc

## Development

## CUD Details

## Insert User
- http://localhost:5007/users/insertUser
- Inserts records in database based on name. if name exists, User will not be inserted.  If name doesn't exist, new user will be created.
- Input user object data format
{
    "userId": 204,
    "name": "Raybanthree",
    "joinDate": "2021-01-12",
    "bio": "BIO details",
    "avatarUrl": "https://sdc-airbnb-userphotos.s3.amazonaws.com/1614831644869.jpg",
    "isSuperhost": true,
    "identityVerified": true,
    "languages": ['French', 'English'],
    "responseRate": 93,
    "responseTime": "within an hour"
}

## Update User
- http://localhost:5007/users/updateUser
- User detail is updated based on userId provided
- Input userdata format :

{
    "userId": 203,
    "name": "Shray UPDATE1 9",
    "joinDate": "2021-01-12",
    "bio": "BIO details",
    "avatarUrl": "https://sdc-airbnb-userphotos.s3.amazonaws.com/1614831644869.jpg",
    "isSuperhost": true,
    "identityVerified": true,
    "languages": ['French', 'Spanish'],
    "responseRate": 93,
    "responseTime": "within an hour"
}

## Delete User
- http://localhost:5007/users/deleteUser
- User record is deleted based on userId provided
- Input userdata format :
{
    "userId": 204
}

### Installing Dependencies

From within the root directory:

```sh
npm install
npm run seed
npm run client-dev
npm run start
```

