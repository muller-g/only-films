import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Cover {
  name: string;
  original_name: string;
  path: string;
}

interface Movie {
  id: string;
  category: string;
  title: string;
  release_date: string;
  cover: Cover;
  _count: any;
  averageRate: number;
}

const AllMovies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const { user, token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const getMovies = async () => {
    await axios.get(process.env.REACT_APP_API_URL + '/api/all-movies', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => setMovies(res.data))
      .catch(() => setMovies([]));
  };

  useEffect(() => {
    getMovies();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  const filteredMovies = movies.filter(movie => {
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         movie.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  useEffect(() => {
    if(searchTerm === '') {
      getMovies();
    } else {
      setMovies(filteredMovies);
    }
  }, [searchTerm]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos os Filmes</h1>
          <p className="text-gray-600">Veja todos os filmes e reviews de todos os usuários</p>
          <div className='flex items-center space-x-4 mt-4'>
              <input
                type="text"
                placeholder="Buscar por título ou review..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {movies.length > 0 ? (
            movies.map(movie => (
              <div key={movie.id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <img
                      src={process.env.REACT_APP_API_URL + '/' + movie?.cover?.path + '/' + movie?.cover?.name}
                      alt={movie.title}
                      className="w-32 h-48 object-cover rounded-lg shadow-md"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        <Link to={`/movie/${movie.id}`} className="hover:underline text-indigo-700">
                          {movie.title}
                        </Link>
                      </h3>
                      <div>
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                            {movie.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            {movie.release_date}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {renderStars(movie.averageRate)}
                        <span className="text-sm text-gray-600">({movie.averageRate.toFixed(1)}/5)</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-4 mt-4">
                      {"Reviews: " + movie?._count?.reviews}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum review encontrado</h3>
              <p className="text-gray-600 mb-6">Nenhum review foi cadastrado ainda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMovies; 