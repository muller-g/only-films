import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../css/embla.css';
import EmblaCarousel from '../components/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel'

interface Cover {
  name: string;
  original_name: string;
  path: string;
}

interface ProfilePhoto {
  name: string;
  path: string;
}

interface User {
  id: string;
  name: string;
  profile_photo?: ProfilePhoto;
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
  created_at: Date;
  user: User;
  review: string;
  season_number: number | null;
}

interface UserReviewGroup {
  user: User;
  general: Review | null;
  seasons: Review[];
}

const formatDate = (d: Date | string) =>
  new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

const Stars: React.FC<{ rating: number; size?: string }> = ({ rating, size = 'text-sm' }) => (
  <>
    {[1, 2, 3, 4, 5].map(s => (
      <span key={s} className={`${size} ${s <= rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ))}
  </>
);

const ClickableStars: React.FC<{ rating: number; onChange: (r: number) => void }> = ({ rating, onChange }) => (
  <div className="flex items-center space-x-1">
    {[1, 2, 3, 4, 5].map(s => (
      <button
        key={s}
        type="button"
        onClick={() => onChange(s)}
        className={`text-2xl transition duration-200 ${s <= rating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
      >
        ★
      </button>
    ))}
    <span className="ml-1 text-sm text-gray-500">({rating}/5)</span>
  </div>
);

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const OPTIONS: EmblaOptionsType = { loop: true };

  const [reviews, setReviews] = useState<Review[]>([]);
  const [movie, setMovie] = useState<any>();
  const [similars, setSimilars] = useState([]);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState('');
  const [seasonForms, setSeasonForms] = useState<{ review: string; rating: number }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isTv = movie?.type === 'tv';

  const getMovie = async () => {
    await axios
      .get(process.env.REACT_APP_API_URL + '/api/movie/' + id, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(res => {
        setReviews(res.data.reviews);
        setMovie(res.data);
        setSimilars(res.data.similars);
      })
      .catch(() => setReviews([]));
  };

  useEffect(() => { getMovie(); }, []);

  const addSeason = () => setSeasonForms(prev => [...prev, { review: '', rating: 5 }]);
  const removeSeason = (i: number) => setSeasonForms(prev => prev.filter((_, idx) => idx !== i));
  const updateSeason = (i: number, field: 'review' | 'rating', value: string | number) =>
    setSeasonForms(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isTv && !userReview.trim() && seasonForms.length === 0) return;
    if (seasonForms.some(s => !s.review.trim())) return;

    setIsSubmitting(true);
    try {
      if (userReview.trim()) {
        await axios.post(
          process.env.REACT_APP_API_URL + '/api/create-review',
          { userId: user?.id, movieId: id, rate: userRating, review: userReview, seasonNumber: null },
          { headers: { Authorization: 'Bearer ' + token } }
        );
      }

      for (let i = 0; i < seasonForms.length; i++) {
        await axios.post(
          process.env.REACT_APP_API_URL + '/api/create-review',
          { userId: user?.id, movieId: id, rate: seasonForms[i].rating, review: seasonForms[i].review, seasonNumber: i + 1 },
          { headers: { Authorization: 'Bearer ' + token } }
        );
      }

      setUserReview('');
      setUserRating(5);
      setSeasonForms([]);
      setShowReviewForm(false);
      await getMovie();
    } catch {
      // silencioso — pode exibir toast se quiser
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleForm = () => {
    setShowReviewForm(v => !v);
    setUserReview('');
    setUserRating(5);
    setSeasonForms([]);
  };

  // Group reviews by user for display
  const buildGroups = (source: Review[]): UserReviewGroup[] => {
    const map: Record<string, UserReviewGroup> = {};
    source.forEach(r => {
      const uid = r.user.id;
      if (!map[uid]) map[uid] = { user: r.user, general: null, seasons: [] };
      if (r.season_number === null) {
        map[uid].general = r;
      } else {
        map[uid].seasons.push(r);
      }
    });
    Object.values(map).forEach(g =>
      g.seasons.sort((a, b) => (a.season_number ?? 0) - (b.season_number ?? 0))
    );
    return Object.values(map);
  };

  const userGroups = buildGroups(reviews);
  const averageRate = reviews.length > 0 ? movie.total_rate / reviews.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 px-2 sm:px-4 lg:px-8 pt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Coluna esquerda: info + formulário */}
        <div className="sticky top-20 flex flex-col gap-4" style={{ alignSelf: 'start' }}>
          <div className="w-full p-8 flex flex-col items-center bg-white rounded-2xl shadow-xl">
            <div className="w-40 h-60 bg-gray-200 rounded-lg mb-6">
              {movie?.image ? (
                <img src={movie.image} alt={movie.title} className="w-full h-full object-cover rounded-lg shadow-md" />
              ) : (
                <img
                  src={process.env.REACT_APP_API_URL + '/' + movie?.cover?.path + '/' + movie?.cover?.name}
                  alt={movie?.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              )}
            </div>

            <h2 className="text-2xl font-bold mb-2 text-center">{movie?.title}</h2>
            <p className="text-gray-600 mb-1">Categoria: <span className="font-medium">{movie?.category}</span></p>
            <p className="text-gray-600 mb-2">Lançamento: <span className="font-medium">{movie?.release_date}</span></p>

            <div className="flex items-center space-x-1 mb-4">
              <Stars rating={Math.round(averageRate)} size="text-2xl" />
              <span className="ml-2 text-sm text-gray-600">({averageRate?.toFixed(1)}/5)</span>
            </div>

            <button
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 mb-2"
              onClick={handleToggleForm}
            >
              {showReviewForm ? 'Cancelar' : 'Deixar minha review'}
            </button>

            {showReviewForm && (
              <form onSubmit={handleSubmitReview} className="w-full mt-2 space-y-4">

                {/* Review geral */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-semibold text-gray-700">
                      {isTv ? 'Review geral da série' : 'Sua review'}
                    </p>
                    {isTv && <span className="text-xs text-gray-400">(opcional)</span>}
                  </div>

                  <ClickableStars rating={userRating} onChange={setUserRating} />

                  <textarea
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                    rows={3}
                    required={!isTv}
                    placeholder={isTv ? 'Sua opinião geral sobre a série...' : 'Sua review...'}
                    value={userReview}
                    onChange={e => setUserReview(e.target.value)}
                  />
                </div>

                {/* Temporadas (só para séries) */}
                {isTv && (
                  <div className="space-y-3">
                    {seasonForms.map((season, i) => (
                      <div key={i} className="border border-indigo-200 rounded-xl p-4 space-y-3 bg-indigo-50">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-semibold text-indigo-800">Temporada {i + 1}</p>
                          {i === seasonForms.length - 1 && (
                            <button
                              type="button"
                              onClick={() => removeSeason(i)}
                              className="text-xs text-red-500 hover:text-red-700"
                            >
                              Remover
                            </button>
                          )}
                        </div>
                        <ClickableStars rating={season.rating} onChange={r => updateSeason(i, 'rating', r)} />
                        <textarea
                          className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none bg-white"
                          rows={3}
                          placeholder={`Sua opinião sobre a temporada ${i + 1}...`}
                          value={season.review}
                          onChange={e => updateSeason(i, 'review', e.target.value)}
                        />
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addSeason}
                      className="w-full py-2 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 text-sm font-medium hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 flex items-center justify-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Adicionar Temporada {seasonForms.length + 1}
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition duration-200 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar review'}
                </button>
              </form>
            )}
          </div>

          <div className="w-full p-8 flex flex-col items-center bg-white rounded-2xl shadow-xl overflow-hidden">
            <h1 className="mb-6">Filmes Recomendados</h1>
            <EmblaCarousel slides={similars} options={OPTIONS} />
          </div>
        </div>

        {/* Coluna direita: reviews */}
        <div className="flex flex-col col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Reviews dos usuários</h3>

            {userGroups.length === 0 ? (
              <p className="text-gray-500 text-sm">Nenhuma review ainda. Seja o primeiro!</p>
            ) : (
              <ul className="space-y-6">
                {userGroups.map(group => (
                  <li key={group.user.id} className="border-b pb-6 last:border-b-0 last:pb-0">
                    {/* Cabeçalho do usuário */}
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={
                          group.user.profile_photo
                            ? process.env.REACT_APP_API_URL + '/' + group.user.profile_photo.path + '/' + group.user.profile_photo.name
                            : 'https://via.placeholder.com/40x40/6366f1/ffffff?text=U'
                        }
                        alt={group.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium text-indigo-600">{group.user.name}</span>
                    </div>

                    {/* Review geral */}
                    {group.general && (
                      <div className="mb-3">
                        {isTv && (
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Review geral</p>
                        )}
                        <div className="flex items-center gap-2 mb-1">
                          <Stars rating={group.general.rate} />
                          <span className="text-xs text-gray-400">{formatDate(group.general.created_at)}</span>
                        </div>
                        <p className="text-gray-600 text-sm">{group.general.review}</p>
                      </div>
                    )}

                    {/* Reviews por temporada */}
                    {group.seasons.length > 0 && (
                      <div className="space-y-3 mt-3">
                        {group.seasons.map(season => (
                          <div key={season.id} className="bg-indigo-50 rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-indigo-700">
                                Temporada {season.season_number}
                              </span>
                              <Stars rating={season.rate} />
                              <span className="text-xs text-gray-400 ml-auto">{formatDate(season.created_at)}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{season.review}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default MovieDetails;
