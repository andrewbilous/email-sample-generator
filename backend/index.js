import Fastify from 'fastify';
import cors from '@fastify/cors';
import routes from './src/routes/index.js';
import knexPlugin from './plugin/knex.js';

/**
 * @type {import('fastify').FastifyInstance}
 */
const fastify = Fastify({
  logger: true
});

await fastify.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'OPTIONS']
});

fastify.register(knexPlugin); 

await fastify.register(routes);

fastify.listen({ port: process.env.PORT || 3001 }, function (err, address) {
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  console.log(`🚀 Server running at ${address}`);
});