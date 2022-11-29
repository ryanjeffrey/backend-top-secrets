const pool = require('../utils/pool');

class Secret {
  id;
  title;
  description;
  createdAt;

  constructor({ id, title, description, created_at }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.createdAt = created_at;
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * from secrets');
    return rows.map((secret) => new Secret(secret));
  }

  static async insert(secret) {
    const { rows } = await pool.query(
      `
      INSERT INTO secrets (title, description)
      VALUES ($1, $2)
      RETURNING *
      `,
      [secret.title, secret.description]
    );
    return new Secret(rows[0]);
  }
}

module.exports = { Secret };
