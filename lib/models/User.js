const pool = require('../utils/pool');

class User {
  id;
  firstName;
  lastName;
  email;
  #passwordHash;

  constructor({ id, first_name, last_name, email, password_hash }) {
    this.id = id;
    this.firstName = first_name;
    this.lastName = last_name;
    this.email = email;
    this.#passwordHash = password_hash;
  }

  static async insert({ firstName, lastName, email, passwordHash }) {
    const { rows } = await pool.query(
      `
    INSERT INTO users (first_name, last_name, email, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [firstName, lastName, email, passwordHash]
    );
    return new User(rows[0]);
  }
}

module.exports = { User };
