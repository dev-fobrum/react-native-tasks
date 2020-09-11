// Update with your config settings.

module.exports = {
  client: 'pg',
  connection: {
    host: 'localhost',
    database: 'tasks',
    user: 'cod3r',
    password: '12345678',
    port: 5432,
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations'
  }
};
