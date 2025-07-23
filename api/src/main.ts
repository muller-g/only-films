import app from './infra/server';
import LoginController from './infra/http/api/LoginController';
import ReviewController from './infra/http/api/ReviewController';
import UserController from './infra/http/api/UserController';
import logger from './service/WinstonLogger';
import AdminController from './infra/http/api/AdminController';
import MovieController from './infra/http/api/MovieController';

new UserController();
new LoginController();
new ReviewController();
new AdminController();
new MovieController();

app.listen(3001, () => {
    logger.info(`Express is listening at http://localhost:3001`);
});