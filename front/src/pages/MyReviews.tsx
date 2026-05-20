import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

interface Review {
  id: string;
  movie: Movie;
  rate: number;
  review: string;
  season_number: number | null;
  created_at: string;
}

interface MovieReviewGroup {
  movie: Movie;
  general: Review | null;
  seasons: Review[];
  latestAt: string;
}

const MyReviews: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedType, setSelectedType] = useState('all');
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [movieCategories, setMovieCategories] = useState<[]>([]);
  const [tvCategories, setTvCategories] = useState<[]>([]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));
  };

  // Group individual review records by movie, separating general from seasons
  const buildGroups = (source: Review[]): MovieReviewGroup[] => {
    const map: Record<string, MovieReviewGroup> = {};

    source.forEach(review => {
      const movieId = review.movie.id;
      if (!map[movieId]) {
        map[movieId] = { movie: review.movie, general: null, seasons: [], latestAt: review.created_at };
      }
      if (review.season_number === null) {
        map[movieId].general = review;
      } else {
        map[movieId].seasons.push(review);
      }
      if (new Date(review.created_at) > new Date(map[movieId].latestAt)) {
        map[movieId].latestAt = review.created_at;
      }
    });

    Object.values(map).forEach(group => {
      group.seasons.sort((a, b) => (a.season_number ?? 0) - (b.season_number ?? 0));
    });

    return Object.values(map);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || review.movie.category === selectedCategory;
    const matchesType = selectedType === 'all' || review.movie.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const groups = buildGroups(filteredReviews);

  const sortedGroups = [...groups].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.latestAt).getTime() - new Date(a.latestAt).getTime();
      case 'oldest':
        return new Date(a.latestAt).getTime() - new Date(b.latestAt).getTime();
      case 'rating':
        return (b.general?.rate ?? 0) - (a.general?.rate ?? 0);
      case 'title':
        return a.movie.title.localeCompare(b.movie.title);
      default:
        return 0;
    }
  });

  useEffect(() => {
    const getReviews = async () => {
      await axios.get(process.env.REACT_APP_API_URL + '/api/user-reviews/' + user?.id, {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(res => setReviews(res.data)).catch(() => null);
    };

    const getTvCategories = async () => {
      await axios.get(process.env.REACT_APP_API_URL + '/api/get-tv-genres', {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(res => setTvCategories(res.data));
    };

    const getMovieCategories = async () => {
      await axios.get(process.env.REACT_APP_API_URL + '/api/get-movie-genres', {
        headers: { 'Authorization': 'Bearer ' + token }
      }).then(res => setMovieCategories(res.data));
    };

    getReviews();
    getMovieCategories();
    getTvCategories();
  }, []);

  const movieImage = (group: MovieReviewGroup) => {
    if (group.movie.image) {
      return <img src={group.movie.image} alt={group.movie.title} className="w-28 h-40 object-cover rounded-lg shadow-md flex-shrink-0" />;
    }
    return (
      <img
        src={process.env.REACT_APP_API_URL + '/' + group.movie.cover?.path + '/' + group.movie.cover?.name}
        alt={group.movie.title}
        className="w-28 h-40 object-cover rounded-lg shadow-md flex-shrink-0"
      />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Meus Reviews</h1>
              <p className="text-gray-600">Gerencie e visualize todos os seus reviews de filmes</p>
            </div>
            <Link
              to="/add-review"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
            >
              Novo Review
            </Link>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
              <input
                type="text"
                placeholder="Buscar por título ou review..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              />
            </div>

            <div className="w-full md:w-1/5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="all">Todos</option>
                <option value="movie">Filme</option>
                <option value="tv">Série</option>
              </select>
            </div>

            <div className="w-full md:w-1/5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="all">Todos</option>
                {(selectedType === 'movie' ? movieCategories : tvCategories).map((category: any) => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            <div className="w-full md:w-1/5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="rating">Melhor avaliação</option>
                <option value="title">Título A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{reviews.length}</p>
                <p className="text-sm text-gray-600">Total de Reviews</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews.length > 0
                    ? (reviews.reduce((acc, r) => acc + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
                    : '—'}
                </p>
                <p className="text-sm text-gray-600">Avaliação Média</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(reviews.map(r => r.movie.category)).size}
                </p>
                <p className="text-sm text-gray-600">Categorias</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {reviews[0]?.created_at ? formatDate(reviews[0].created_at) : '—'}
                </p>
                <p className="text-sm text-gray-600">Último Review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Lista de Reviews agrupados por filme */}
        <div className="space-y-6">
          {sortedGroups.length > 0 ? (
            sortedGroups.map(group => (
              <div key={group.movie.id} className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex gap-6">
                  {/* Poster */}
                  {movieImage(group)}

                  {/* Conteúdo */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        <Link to={`/movie/${group.movie.id}`} className="hover:underline text-indigo-700">
                          {group.movie.title}
                        </Link>
                      </h3>
                      {group.movie.type === 'tv' && (
                        <span className="ml-2 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full font-medium whitespace-nowrap">Série</span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                        {group.movie.category}
                      </span>
                      <span className="text-sm text-gray-500">{group.movie.release_date}</span>
                    </div>

                    {/* Review Geral */}
                    {group.general && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-1">
                          {renderStars(group.general.rate)}
                          <span className="text-sm text-gray-500">({group.general.rate ?? '—'}/5)</span>
                          <span className="text-xs text-gray-400">· {formatDate(group.general.created_at)}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed text-sm line-clamp-3">
                          {group.general.review}
                        </p>
                      </div>
                    )}

                    {/* Reviews por Temporada */}
                    {group.seasons.length > 0 && (
                      <div className="space-y-3 border-t border-gray-100 pt-3">
                        {group.seasons.map(season => (
                          <div key={season.id} className="bg-indigo-50 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-semibold text-indigo-700">
                                Temporada {season.season_number}
                              </span>
                              <div className="flex items-center gap-1">
                                {renderStars(season.rate)}
                                <span className="text-xs text-gray-500">({season.rate ?? '—'}/5)</span>
                              </div>
                              <span className="text-xs text-gray-400 ml-auto">{formatDate(season.created_at)}</span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                              {season.review}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3 mt-4">
                      <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 text-sm">
                        Editar
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition duration-200 text-sm">
                        Excluir
                      </button>
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
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Tente ajustar os filtros de busca'
                  : 'Comece criando seu primeiro review de filme'}
              </p>
              <Link
                to="/add-review"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Criar Primeiro Review
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviews;
