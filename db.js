const {Pool} = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('connected to db');
})

/* Create Dog Table */
const createDogTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      dogs(
        id UUID PRIMARY KEY,
        name TEXT NOT NULL,
        age SMALLINT NOT NULL,
        breed TEXT NOT NULL,
        owner_id UUID NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES owners (id) ON DELETE CASCADE
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/* Create Owner Table */
const createOwnerTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      owners(
        id UUID PRIMARY KEY,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

    pool.query(queryText)
      .then((res) => {
        console.log(res);
        pool.end();
      })
      .catch((err) => {
        console.log(err);
        pool.end();
      });
}
/* Drop Dog Table */
const dropDogTable = () => {
  const queryText = `DROP TABLE IF EXISTS dogs returning *`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

/* Drop Owner Table */
const dropOwnerTable = () => {
  const queryText = `DROP TABLE IF EXISTS owners returning *`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    })
}

/* Create All Tables */
const createAllTables = () => {
  createDogTable();
  createOwnerTable();
}

/* Drop All Tables */
const dropAllTables = () => {
  dropOwnerTable();
  dropDogTable();
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createDogTable, dropDogTable,
  createOwnerTable, dropOwnerTable, createAllTables,
  dropAllTables
};

require('make-runnable');
