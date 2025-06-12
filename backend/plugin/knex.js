import fp from 'fastify-plugin';
import knex from 'knex';

export default fp(async function (fastify, opts) {
  const db = knex({
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
  });

  fastify.decorate('knex', db);
});