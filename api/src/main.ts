import app from './infra/server';
import LoginController from './infra/http/api/LoginController';
import ReviewController from './infra/http/api/ReviewController';
import UserController from './infra/http/api/UserController';
import logger from './service/WinstonLogger';
import AdminController from './infra/http/api/AdminController';
import MovieController from './infra/http/api/MovieController';
import TmdbApiController from './infra/http/api/TmdbApiController';
import MovieGenresController from './infra/http/api/MovieGenresController';
import TvGenresController from './infra/http/api/TvGenresController';

new UserController();
new TmdbApiController();
new MovieGenresController();
new TvGenresController();
new LoginController();
new ReviewController();
new AdminController();
new MovieController();

app.listen(3001, () => {
    logger.info(`Express is listening at http://localhost:3001`);
});