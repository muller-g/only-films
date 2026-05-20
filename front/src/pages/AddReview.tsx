import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

interface ReviewFormData {
  title: string;
  category: string;
  review: string;
  releaseDate: string;
  rating: number;
  image: string;
  type: string;
  tmdbMovieId: number | null;
  tmdbGenreId: number | null;
}

interface SeasonReview {
  review: string;
  rating: number;
}

const AddReview: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const MySwal = withReactContent(Swal);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [foundMovies, setFoundMovies] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [seasonReviews, setSeasonReviews] = useState<SeasonReview[]>([]);
  const [formData, setFormData] = useState<ReviewFormData>({
    title: '',
    category: '',
    review: '',
    releaseDate: '',
    rating: 5,
    image: '',
    type: 'movie',
    tmdbMovieId: null,
    tmdbGenreId: null,
  });

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/get-${formData.type}-genres`,
          { headers: { Authorization: 'Bearer ' + token } }
        );
        setGenres(res.data);
      } catch {
        setGenres([]);
      }
    };
    fetchGenres();
  }, [formData.type, token]);

  const handleTypeChange = (type: string) => {
    setFormData({
      title: '',
      category: '',
      review: '',
      releaseDate: '',
      rating: 5,
      image: '',
      type,
      tmdbMovieId: null,
      tmdbGenreId: null,
    });
    setFoundMovies([]);
    setSeasonReviews([]);
  };

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, title: value, tmdbMovieId: null, tmdbGenreId: null, image: '', category: '', releaseDate: '' }));

    if (value.length >= 3) {
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/search-content`,
          { search: value, type: formData.type },
          { headers: { Authorization: 'Bearer ' + token } }
        );
        setFoundMovies(res.data.results || []);
      } catch {
        setFoundMovies([]);
      }
    } else {
      setFoundMovies([]);
    }
  };

  const handleMovieSelect = (movie: any, index: number) => {
    const matchedGenre = genres.find(g => g.tmdb_id === movie.genre_ids?.[0]);

    setFormData(prev => ({
      ...prev,
      title: formData.type === 'movie' ? movie.title : movie.name,
      category: matchedGenre?.name || '',
      releaseDate: formData.type === 'movie'
        ? movie?.release_date?.split('-')[0] || ''
        : movie?.first_air_date?.split('-')[0] || '',
      image: movie.poster_path ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` : '',
      tmdbMovieId: movie.id,
      tmdbGenreId: movie.genre_ids?.[0] ?? null,
    }));

    document.querySelectorAll('#movie-opt').forEach((el: any) => {
      el.classList.remove('bg-indigo-100', 'border-indigo-500', 'border-2', 'border-dashed', 'shadow-lg', 'shadow-indigo-500', 'rounded-lg');
    });
    const selected = document.querySelectorAll('#movie-opt')[index] as HTMLElement | undefined;
    selected?.classList.add('bg-indigo-100', 'border-indigo-500', 'border-2', 'border-dashed', 'shadow-lg', 'shadow-indigo-500', 'rounded-lg');
  };

  const addSeason = () => {
    setSeasonReviews(prev => [...prev, { review: '', rating: 5 }]);
  };

  const removeSeason = (index: number) => {
    setSeasonReviews(prev => prev.filter((_, i) => i !== index));
  };

  const updateSeasonReview = (index: number, field: keyof SeasonReview, value: string | number) => {
    setSeasonReviews(prev =>
      prev.map((season, i) => i === index ? { ...season, [field]: value } : season)
    );
  };

  const renderStars = (rating: number, onChange: (star: number) => void) => (
    <div className="flex items-center space-x-2">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-2xl transition duration-200 ${
            star <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tmdbMovieId) {
      MySwal.fire({ title: <p>Aviso</p>, text: 'Selecione um filme ou série da lista antes de continuar.', icon: 'warning' });
      return;
    }

    if (formData.type === 'tv' && !formData.review.trim() && seasonReviews.length === 0) {
      MySwal.fire({ title: <p>Aviso</p>, text: 'Adicione ao menos uma review geral ou uma temporada antes de continuar.', icon: 'warning' });
      return;
    }

    if (seasonReviews.some(s => !s.review.trim())) {
      MySwal.fire({ title: <p>Aviso</p>, text: 'Preencha o texto de todas as temporadas adicionadas antes de continuar.', icon: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      const movieRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/create-movie`,
        {
          title: formData.title,
          category: formData.tmdbGenreId,
          releaseDate: formData.releaseDate,
          image: formData.image,
          type: formData.type,
          id: formData.tmdbMovieId,
          userId: user?.id,
        },
        { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token } }
      );

      const localMovieId = movieRes.data?.id;
      if (!localMovieId) throw new Error('Movie ID not returned');

      if (formData.review.trim()) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/create-review`,
          {
            userId: user?.id,
            movieId: localMovieId,
            review: formData.review,
            rate: formData.rating,
            seasonNumber: null,
          },
          { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token } }
        );
      }

      for (let i = 0; i < seasonReviews.length; i++) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/create-review`,
          {
            userId: user?.id,
            movieId: localMovieId,
            review: seasonReviews[i].review,
            rate: seasonReviews[i].rating,
            seasonNumber: i + 1,
          },
          { headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token } }
        );
      }

      setFormData({
        title: '', category: '', review: '', releaseDate: '', rating: 5,
        image: '', type: 'movie', tmdbMovieId: null, tmdbGenreId: null,
      });
      setFoundMovies([]);
      setSeasonReviews([]);

      MySwal.fire({ title: <p>Sucesso</p>, text: 'Review cadastrada com sucesso!', icon: 'success' });
    } catch {
      MySwal.fire({ title: <p>Algo deu errado</p>, text: 'Erro ao cadastrar review. Tente novamente.', icon: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cadastrar Nova Review</h1>
          <p className="text-gray-600">Compartilhe sua experiência cinematográfica com a comunidade</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Tipo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
              <div className="flex items-center space-x-6">
                {[{ value: 'movie', label: 'Filme' }, { value: 'tv', label: 'Série' }].map(({ value, label }) => (
                  <label key={value} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value={value}
                      checked={formData.type === value}
                      onChange={() => handleTypeChange(value)}
                      className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Busca de título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                {formData.type === 'movie' ? 'Título do Filme' : 'Título da Série'} *
              </label>
              <input
                type="text"
                id="title"
                autoComplete="off"
                value={formData.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder={formData.type === 'movie' ? 'Ex: O Poderoso Chefão' : 'Ex: Breaking Bad'}
              />
            </div>

            {/* Grid de resultados TMDB */}
            {foundMovies.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {foundMovies.map((movie, i) => (
                  <div
                    id="movie-opt"
                    key={movie.id}
                    onClick={() => handleMovieSelect(movie, i)}
                    className="text-center flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-all duration-300 p-1"
                  >
                    {movie.poster_path ? (
                      <img
                        width={80}
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={formData.type === 'movie' ? movie.title : movie.name}
                        className="rounded shadow"
                      />
                    ) : (
                      <div className="w-20 h-28 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">Sem capa</div>
                    )}
                    <span className="text-xs mt-1 text-center whitespace-normal leading-tight">
                      {formData.type === 'movie' ? movie.title : movie.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Pôster do selecionado */}
            {formData.image && (
              <div className="flex items-center space-x-4 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <img src={formData.image} alt={formData.title} className="w-16 rounded shadow" />
                <div>
                  <p className="font-semibold text-gray-800">{formData.title}</p>
                  {formData.category && <p className="text-sm text-gray-500">{formData.category} · {formData.releaseDate}</p>}
                </div>
              </div>
            )}

            {/* Categoria (somente leitura) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
              <select
                value={formData.category}
                disabled
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              >
                <option value="">Preenchido ao selecionar um título</option>
                {genres.map(g => (
                  <option key={g.tmdb_id} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>

            {/* Review Geral */}
            <div className="border border-gray-200 rounded-xl p-5 space-y-4">
              <div className="flex items-baseline gap-2">
                <h3 className="text-base font-semibold text-gray-800">
                  {formData.type === 'tv' ? 'Review Geral da Série' : 'Sua Review'}
                </h3>
                {formData.type === 'tv' && (
                  <span className="text-xs text-gray-400">(opcional — preencha se quiser uma visão geral)</span>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avaliação{formData.type === 'movie' ? ' *' : ''}
                </label>
                {renderStars(formData.rating, star => setFormData(prev => ({ ...prev, rating: star })))}
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.type === 'tv' ? 'Texto da review geral' : 'Texto da Review *'}
                </label>
                <textarea
                  id="review"
                  required={formData.type === 'movie'}
                  rows={5}
                  value={formData.review}
                  onChange={e => setFormData(prev => ({ ...prev, review: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none"
                  placeholder={formData.type === 'tv' ? 'Sua opinião geral sobre a série...' : 'Compartilhe sua opinião sobre o filme...'}
                />
              </div>
            </div>

            {/* Temporadas (só para séries) */}
            {formData.type === 'tv' && (
              <div className="space-y-4">
                {seasonReviews.map((season, index) => (
                  <div key={index} className="border border-indigo-200 rounded-xl p-5 space-y-4 bg-indigo-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold text-indigo-800">Temporada {index + 1}</h3>
                      {index === seasonReviews.length - 1 && (
                        <button
                          type="button"
                          onClick={() => removeSeason(index)}
                          className="text-sm text-red-500 hover:text-red-700 transition duration-200"
                        >
                          Remover
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Avaliação</label>
                      {renderStars(season.rating, star => updateSeasonReview(index, 'rating', star))}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Texto da Review</label>
                      <textarea
                        rows={4}
                        value={season.review}
                        onChange={e => updateSeasonReview(index, 'review', e.target.value)}
                        className="w-full px-4 py-3 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none bg-white"
                        placeholder={`Sua opinião sobre a temporada ${index + 1}...`}
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addSeason}
                  className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 font-medium hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Adicionar Temporada {seasonReviews.length + 1}
                </button>
              </div>
            )}

            {/* Botões */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Cadastrando...
                  </div>
                ) : (
                  'Cadastrar Review'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;
