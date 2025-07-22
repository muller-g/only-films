import app from './infra/server';
import LoginController from './infra/http/api/LoginController';
import ReviewController from './infra/http/api/ReviewController';
import UserController from './infra/http/api/AdminController';
import logger from './service/WinstonLogger';
import AdminController from './infra/http/api/AdminController';

new UserController();
new LoginController();
new ReviewController();
new AdminController();

app.listen(3001, () => {
    logger.info(`Express is listening at http://localhost:3001`);
});