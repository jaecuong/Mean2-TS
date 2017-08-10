import * as bodyParser from 'body-parser';
import * as cluster from 'cluster'; // increase performance for NodeJs
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
// import * as expressJwt from 'express-Jwt';
// import jwt from 'jsonwebtoken';
// import passport from 'passport';
// import passportJWT from 'passport-jwt';
// const ExtractJwt = passportJWT.ExtractJwt;
// const JwtStrategy = passportJWT.Strategy;

import * as http from 'http';
import * as morgan from 'morgan';
import * as os from 'os';
import * as path from 'path';
import * as cors from 'cors';
import { configs } from '../configs/index';
import { logger, skip, stream } from './utils/index';
// import { router as productRouter } from './routers/product-router';

import { Express, Request, Response } from 'express';
import { Worker } from 'cluster';
import { setRoutes } from './routes';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';
const chalk = require('chalk');

// import { flash } from 'connect-flash';
// import { session } from 'express-session';
// import { passport } from 'passport';
// import { setupStrategies } from './services/profile/passport';

// options for cors midddleware ---> should review it carefully
// const options: cors.CorsOptions = {
//   // tslint:disable-next-line:max-line-length
//   // allowedHeaders: ['Access-Control-Allow-Headers', 'Content-Type',
//   //   'X-Requested-With', 'Content-Type', 'Authorization'],
//   // 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials, X-Access-Token'
//   credentials: false,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 'PUT, GET, POST, DELETE, OPTIONS'
//   // origin: configs.getServerConfig().apiUrl, // *
//   origin: '*', // *
//   preflightContinue: false
// };

interface ServerAddress {
  address: string;
  port: number;
  addressType: string;
}

class Server {
  private _app: Express;
  private _server: http.Server;

  constructor() {
    this._app = express();
    dotenv.load({ path: '.env' });

    this._app.use(compression());
    // this._app.use('/', express.static(path.join(__dirname, '../public')));
    this._app.use(bodyParser.json()); // Parses urlencoded bodies
    this._app.use(bodyParser.urlencoded({ extended: false })); // Send JSON responses
    this._app.use(cookieParser());
    this._app.use(express.static(configs.getServerConfig().publicPath));
    this._app.use(morgan('combined', { skip: skip, stream: <any>stream }));
    // this._app.use(cors()); // deal with any Cross Origin Resource Sharing (CORS) issues we might run into
    // enable pre-flight
    this._app.options('*', cors());

    // use JWT auth to secure the api
    // tslint:disable-next-line:max-line-length
    // this._app.use(expressJwt({ secret: configs.getServerConfig().session.secret }).unless({ path: ['/profiles/authen', '/profiles/signup','/profiles/signin'] }));
    // setRoutes(this._app);
    // this._app.get('/api/uu', (req, res) => {
    //   res.json('Duoc roi');
    // });

    setRoutes(this._app); // This line must be on top of any routes
    this._app.get('/*', function (req, res) {
      res.sendFile(configs.getServerConfig().publicPathHtml);
    });

    this._app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
      res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Request-Headers', 'charset,content-type');
      next();
    });

    // catch 404 and forward to error handler.
    this._app.use(function (req, res, next) {
      const err = new Error('Not Found');
      err['status'] = 404;
      next(err);
    });

    // error handlers
    if (process.env.NODE_ENV === 'development') {
      this._app.use((error: Error, req: Request, res: Response, next: Function) => {
        logger.error(`Request got error = ${error.message}`);
        res.status(error['status'] || 500);
        res.render('error', {
          message: error.message,
          error: error
        });
      });
    }
    // tslint:disable-next-line:one-line
    else if (process.env.NODE_ENV === 'production') {
      // no stacktraces leaked to user
      this._app.use((error: Error, req: Request, res: Response, next: Function) => {
        res.status(error['status'] || 500);
        res.render('error', {
          message: error.message,
          error: {}
        });
      });
    }

    // error handler
    if (process.env.NODE_ENV === 'development') {
      const connect = require('connect');
      const errorhandler = require('errorhandler');
      const notifier = require('node-notifier');
      // only use in development
      this._app.use(errorhandler({
        log: (err, str, req) => {
          const title = 'Error in ' + req.method + ' ' + req.url

          notifier.notify({
            title: title,
            message: str
          })
        }
      }))
    }



    // this._app.use(flash());
    this._server = http.createServer(this._app);

  }



  private _onError(error: NodeJS.ErrnoException): void {
    if (error.syscall) {
      logger.error(`${error.syscall} with message = ${error.message}`);
      throw error;
    }

    const port = process.env.PORT || 3000;
    const bind = `Port ${port}`;

    switch (error.code) {
      case 'EACCES':
        logger.error(`[EACCES] ${bind} requires elevated privileges.`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        logger.error(`[EADDRINUSE] ${bind} is already in use.`);
        process.exit(1);
        break;
      default:
        throw error;
    }
  };

  private _onListening(): void {
    const address = this._server.address();
    const bind = `port ${address.port}`;
    const interfaces = require('os').networkInterfaces();

    const addresses = Object.keys(interfaces)
      .reduce((results, name) => results.concat(interfaces[name]), [])
      .filter((iface) => iface.family === 'IPv4' && !iface.internal)
      .map((iface) => iface.address);

    console.log(chalk.green(`Server is Listening on ${bind}`));
    console.log(chalk.green('Environment:     ' + process.env.NODE_ENV));
    console.log(chalk.green('Server Name:     ' + os.hostname()));
    console.log(chalk.green('Server IP        ' + addresses));
    console.log(chalk.green('Database:        ' + process.env.MONGODB_URI));
    // console.log(chalk.green('App version:     ' + config.meanjs.version));
  };

  start(): void {
    if (cluster.isMaster) { // Use this line when running in production mode
      // if (cluster.isMaster && process.env.NODE_ENV !== 'development') { // Use this line when running in development mode

      mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });
      // use q promises
      global.Promise = require('q').Promise;
      const db = mongoose.connection;
      mongoose.Promise = global.Promise;

      db.on('error', () => {
        logger.error(`Database connection error !!! ----> ${console}`);
        console.log(chalk.red(`Database connection error !!! ----> ${console}`));
        console.error.bind(console, 'connection error:');
      });

      db.once('open', () => {
        logger.info(`Connected to MongoDB`);

        // this._app.get('/*', function (req, res) {
        //   res.sendFile(path.join(__dirname, '../public/index.html'));
        // });
        const numberWorkers = os.cpus().length;
        logger.info(`Master ${process.pid} is running`);
        logger.info(`Cluster is running on CPU with ${numberWorkers} logical processors`);
        for (let c = 0; c < numberWorkers; c++) {
          cluster.fork();
        }
        this.workerEvents();

      });

    } else { // development code

      this._server.listen(process.env.PORT || 3000, () => {
        logger.info('Process ' + process.pid + ' is listening to all incoming requests');
      });
      this._server.on('error', error => this._onError(error));
      this._server.on('listening', () => this._onListening());

    }
  }

  private workerEvents(): void {
    cluster.on('online', function (worker) {
      logger.info(`Worker ${worker.process.pid} is online`);
    });

    // Listen for dying workers
    cluster.on('exit', (worker: Worker, code: number, signal: string) => {
      if (signal) {
        logger.error(`Worker ${worker.process.pid} was killed by signal: ${signal}`);
      } else if (code !== 0) {
        logger.error(`Worker ${worker.process.pid} exited with error code: ${code}`);
      } else {
        logger.info(`Worker ${worker.process.pid} success!`);
      }
      logger.info(`Starting a new worker`);
      cluster.fork();
    });

    cluster.on('listening', (worker: Worker, address: ServerAddress) => {
      logger.info(`Worker ${worker.process.pid} connected to port ${address.port}.`);
    });
  }

  stop(): void {
    this._server.close();
    // Process reload ongoing close connections, clear cache, etc
    // by default, you have 1600ms
    process.exit(0);
  }
}

const server = new Server();
server.start();
process.on('SIGINT', () => {
  server.stop();
});
