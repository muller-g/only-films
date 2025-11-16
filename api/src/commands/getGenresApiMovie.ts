import axios from "axios";
import MovieGenreService from "../infra/http/service/MovieGenreService";
import TvGenreService from "../infra/http/service/TvGenreService";

async function getGenresApiMovie() {
    try {
        const responseMovie = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=pt-BR`, {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const responseTv = await axios.get(`https://api.themoviedb.org/3/genre/tv/list?language=pt-BR`, {
            headers: {
                'Authorization': `Bearer ${process.env.TMDB_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        responseMovie.data.genres.forEach(async (genre: any) => {
            await MovieGenreService.create(genre);
        });

        responseTv.data.genres.forEach(async (genre: any) => {
            await TvGenreService.create(genre);
        });
    } catch (error) {
        console.error(error);
    }
}

getGenresApiMovie();