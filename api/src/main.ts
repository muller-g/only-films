import app from './infra/server';
import LoginController from './infra/http/api/LoginController';
import ReviewController from './infra/http/api/ReviewController';
import UserController from './infra/http/api/UserController';
import logger from './service/WinstonLogger';

new UserController();
new LoginController();
new ReviewController();

app.listen(3001, () => {
    logger.info(`Express is listening at http://localhost:3001`);
});