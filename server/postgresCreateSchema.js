//to do
const { Pool } = require('pg');
const pool = new Pool({

})

const createOwnersTable = "CREATE TABLE OWNERS( ID SERIAL PRIMARY KEY,  JOINED_DATE DATE, REVIEWS_COUNT INTEGER,IS_IDENTITY_VERIFIED BOOLEAN,  RESPONSE_RATE INT, RESPONSE_TIME_ID INT,  PROFILE_PIC TEXT, IS_SUPER_HOST BOOLEAN, NAME TEXT, OWNER_ID INT );";
const client = pool.connect();
client.query(createOwnersTable)
  .then(function () {
    console.log('schema  was successfully created');
    return;
  })
//   .catch((err) => {
//     console.log(err);
//     console.log('Schema was not created');
//     return;
//   })
//   .then(client.query(createLanguageTable))
//   .then(function () {
//     console.log('schema  was successfully created');
//     return;
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('Schema was not created');
//     return;
//   })
//   .then(client.query(createLanguageTable))
//   .then(function () {
//     console.log('schema  was successfully created');
//     return;
//   })
//   .catch((err) => {
//     console.log(err);
//     console.log('Schema was not created');
//     return;
//   })


// CREATE TABLE public.languages
//   (
//     id integer NOT NULL DEFAULT nextval('languages_id_seq':: regclass),
//     name character(50) COLLATE pg_catalog."default",
//     CONSTRAINT languages_pkey PRIMARY KEY(id)
//   )

// CREATE TABLE public.owner_details
//   (
//     id integer NOT NULL DEFAULT nextval('owner_details_id_seq':: regclass),
//     ownerid integer,
//     during_stay text COLLATE pg_catalog."default",
//     host_desc text COLLATE pg_catalog."default",
//     CONSTRAINT owner_details_pkey PRIMARY KEY(id)
//   )

// CREATE TABLE public.owner_language
//   (
//     ownerid integer,
//     languageid integer
//   )

// CREATE TABLE public.owners
//   (
//     id integer NOT NULL DEFAULT nextval('owners_id_seq':: regclass),
//     joined_date date,
//     reviews_count integer,
//     is_identity_verified boolean,
//     response_rate integer,
//     response_time_id integer,
//     profile_pic text COLLATE pg_catalog."default",
//     is_super_host boolean,
//     name text COLLATE pg_catalog."default",
//     owner_id integer NOT NULL,
//     CONSTRAINT owners_pkey PRIMARY KEY(id)
//   )


// CREATE TABLE public.response_time
//   (
//     id integer NOT NULL DEFAULT nextval('response_time_id_seq':: regclass),
//     description character(100) COLLATE pg_catalog."default",
//     CONSTRAINT response_time_pkey PRIMARY KEY(id)
//   )

// CREATE TABLE public.rooms
//   (
//     id integer NOT NULL DEFAULT nextval('rooms_id_seq':: regclass),
//     owner_id integer NOT NULL,
//     description character(50) COLLATE pg_catalog."default",
//     CONSTRAINT rooms_pkey PRIMARY KEY(id)
//   )


