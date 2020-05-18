/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import { fetchStocks } from './controller/stocks.api.controller';

const init = async () => {
 // const server = new Server({
  //  port: 3333,
  //  host: 'localhost'
  //});

  const server = new Server({
    port: 3333,
    host: 'localhost'
  }
  );

  const add = async (a, b) => {

    return Number(a) + Number(b);
};


  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

server.route({
    method: 'GET',
    path: '/api/fetchStocks/{stockType}/{stcokPeriod}',
    handler: fetchStocks
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();