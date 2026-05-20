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
  image: string;
  type: string;
}

interface ReviewUser {
  id: string;
  name: string;
  profile_photo: Cover | null;
}

interface Review {
  id: string;
  movie: Movie;
  user: ReviewUser;
  rate: number;
  review: string;
  season_number: number | null;
  created_at: string;
}

interface FilterUser {
  id: string;
  name: string;
}

const AllMovies: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<FilterUser[]>([]);
  const { token } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('all');

  const headers = { Authorization: 'Bearer ' + token };

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URL + '/api/all-reviews', { headers })
      .then(res => setReviews(res.data))
      .catch(() => setReviews([]));

    axios.get(process.env.REACT_APP_API_URL + '/api/users', { headers })
      .then(res => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const filtered = reviews.filter(review => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      review.movie.title.toLowerCase().includes(term) ||
      review.review.toLowerCase().includes(term) ||
      review.user.name.toLowerCase().includes(term);
    const matchesUser = selectedUserId === 'all' || review.user.id === selectedUserId;
    return matchesSearch && matchesUser;
  });

  const movieImage = (review: Review) => {
    if (review.movie.image) {
      return (
        <img
          src={review.movie.image}
          alt={review.movie.title}
          className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0"
        />
      );
    }
    return (
      <img
        src={process.env.REACT_APP_API_URL + '/' + review.movie.cover?.path + '/' + review.movie.cover?.name}
        alt={review.movie.title}
        className="w-24 h-36 object-cover rounded-lg shadow-md flex-shrink-0"
      />
    );
  };

  const userAvatar = (user: ReviewUser) => {
    if (user.profile_photo) {
      return (
        <img
          src={process.env.REACT_APP_API_URL + '/' + user.profile_photo.path + '/' + user.profile_photo.name}
          alt={user.name}
          className="w-7 h-7 rounded-full object-cover"
        />
      );
    }
    return (
      <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Todos os Reviews</h1>
          <p className="text-gray-600 mb-4">Veja os reviews de todos os usuários da comunidade</p>
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Buscar por título, review ou usuário..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
            />
            <div className="md:w-56">
              <select
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="all">Todos os usuários</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>
          {selectedUserId !== 'all' && (
            <div className="mt-3">
              <button
                onClick={() => setSelectedUserId('all')}
                className="text-sm text-indigo-600 hover:text-indigo-800 underline"
              >
                Limpar filtro de usuário
              </button>
            </div>
          )}
        </div>

        <div className="mb-4 text-sm text-gray-500">
          {filtered.length} review{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
        </div>

        <div className="space-y-4">
          {filtered.length > 0 ? (
            filtered.map(review => (
              <div key={review.id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex gap-6">
                  {movieImage(review)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        <Link to={`/movie/${review.movie.id}`} className="hover:underline text-indigo-700">
                          {review.movie.title}
                        </Link>
                      </h3>
                      {review.movie.type === 'tv' && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium whitespace-nowrap">
                          Série
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {review.movie.category}
                      </span>
                      {review.season_number != null && (
                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                          Temporada {review.season_number}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      {renderStars(review.rate)}
                      <span className="text-sm text-gray-500">({review.rate}/5)</span>
                    </div>

                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3 mb-3">
                      {review.review}
                    </p>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setSelectedUserId(review.user.id)}
                        className="flex items-center gap-2 group"
                        title="Filtrar por este usuário"
                      >
                        {userAvatar(review.user)}
                        <span className="text-sm font-medium text-indigo-600 group-hover:text-indigo-800 group-hover:underline">
                          {review.user.name}
                        </span>
                      </button>
                      <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum review encontrado</h3>
              <p className="text-gray-600">
                {searchTerm || selectedUserId !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Nenhum review foi cadastrado ainda.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllMovies;
