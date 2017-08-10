import { Request, Response, Router, Express } from 'express';
import * as express from 'express';
import { logger, skip, stream } from './utils/index';

import CatCtrl from './controllers/cat';
import UserCtrl from './controllers/user';
import Cat from './models/cat';
import User from './models/user';
import * as errors from './utils/errors';
import * as path from 'path';

const routes = Router();

export const setRoutes = (app: Express): void => {
     logger.info(`Route setup is starting !!!`);
  const catCtrl = new CatCtrl();
  const userCtrl = new UserCtrl();

  // Apply the routes to our application with the prefix /api
  app.use('/api', routes);

  // Users

  routes.post('/login', userCtrl.login);
  routes.get('/users', userCtrl.getAll);
  routes.get('/users/count', userCtrl.count);
  routes.post('/user', userCtrl.insert);
  routes.get('/user/:id', userCtrl.get);
  routes.put('/user/:id', userCtrl.update);
  routes.delete('/user/:id', userCtrl.delete);

  // const requireAuth = passport.authenticate('jwt', { session: false }); // use for the other route
  // const requireLogin = passport.authenticate('local', { session: false }); // use for route /api/auth/login only
  // Auth Routes
  // app.use('/api/auth', routes.post('/signup', signUp));
  // app.use('/api/auth', routes.post('/login', requireLogin, login));
  // // for testing only
  // app.use('/api/auth', routes.get('/protected', requireAuth, (req: Request, res: Response) => {
  //   res.send({ content: 'Success' });
  // }));


  // app.use('/api/products', routes.get('/', GetAllProducts));
  // app.use('/api/products', routes.post('/', InsertProduct));

  // app.use('/api/profiles', routes.get('/', GetAllProfiles));

  // Implement role authorization in the future only
  // app.use('/api/products',routes.get('/',requireAuth,roleAuthorization(['reader','creator','editor']), productRouter));
}


// export default function setRoutes(app) {
//   logger.info(`Route setup is starting !!!`);
//   const router = express.Router();

//   const catCtrl = new CatCtrl();
//   const userCtrl = new UserCtrl();

//   // Cats
//   router.route('/cats').get(catCtrl.getAll);
//   router.route('/cats/count').get(catCtrl.count);
//   router.route('/cat').post(catCtrl.insert);
//   router.route('/cat/:id').get(catCtrl.get);
//   router.route('/cat/:id').put(catCtrl.update);
//   router.route('/cat/:id').delete(catCtrl.delete);

//   // Users
//   router.route('/login').post(userCtrl.login);
//   router.route('/users').get(userCtrl.getAll);
//   router.route('/users/count').get(userCtrl.count);
//   router.route('/user').post(userCtrl.insert);
//   router.route('/user/:id').get(userCtrl.get);
//   router.route('/user/:id').put(userCtrl.update);
//   router.route('/user/:id').delete(userCtrl.delete);

//   // Apply the routes to our application with the prefix /api
//   app.use('/api', router);

//   // All undefined asset or api routes should return a 404
//   app.route('/:url(api|auth|components|app|libs|assets)/*')
//     .get(errors.pageNotFound);

//   router.route('/api/uu').get((req, res) => {
//     res.json('Duoc roi');
//   });
// }
