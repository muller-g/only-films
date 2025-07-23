import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Cover {
  name: string;
  original_name: string;
  path: string;
}

interface ProfilePhoto {
  name: string;
  original_name: string;
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
}

interface Review {
  id: string;
  movie: Movie;
  rate: number;
  created_at: Date;
  user: User;
  review: string;
}

const MovieDetails: React.FC = () => {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [movie, setMovie] = useState<any>();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [userRating, setUserRating] = useState(5);
  const [userReview, setUserReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getMovie = async () => {
    await axios.get(process.env.REACT_APP_API_URL + '/api/movie/' + id, {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then(res => {
        setReviews(res.data.reviews);
        setMovie(res.data);
      })
      .catch(() => setReviews([]));
  };
  
  useEffect(() => {
    getMovie();
  }, []);

  const handleRateClick = (rate: number) => {
    setUserRating(rate);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(process.env.REACT_APP_API_URL + '/api/create-review', {
        userId: user?.id,
        movieId: id,
        rate: userRating,
        review: userReview
      }, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      setUserReview('');
      setUserRating(5);
      setShowReviewForm(false);
      // Atualiza reviews
      const res = await axios.get(process.env.REACT_APP_API_URL + '/api/review/' + id, {
        headers: { Authorization: 'Bearer ' + token }
      });
      setReviews(res.data);
    } catch {
      // Tratar erro
    } finally {
      setIsSubmitting(false);
      getMovie();
    }
  };

  // Calcula média das notas
  const averageRate = reviews.length > 0 ? movie.total_rate / reviews.length : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 px-2 sm:px-4 lg:px-8 pt-8">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Esquerda: Info do filme e do usuário criador */}
        <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center col-span-1 sticky top-20" style={{alignSelf: 'start'}}>
          {/* Placeholder para imagem do filme */}
          <div className="w-40 h-60 bg-gray-200 rounded-lg mb-6">
            <img
              src={process.env.REACT_APP_API_URL + '/' + movie?.cover?.path + '/' + movie?.cover?.name}
              alt={movie?.title}
              className="w-full h-full object-cover rounded-lg shadow-md"
            />  
          </div>
          <h2 className="text-2xl font-bold mb-2">{movie?.title}</h2>
          <p className="text-gray-600 mb-2">Categoria: <span className="font-medium">{movie?.category}</span></p>
          <p className="text-gray-600 mb-2">Lançamento: <span className="font-medium">{movie?.release_date}</span></p>
          {/* Estrelinhas de avaliação (apenas exibição da média) */}
          <div className="flex items-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                className={`text-2xl ${star <= Math.round(averageRate) ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-sm text-gray-600">({averageRate?.toFixed(1)}/5)</span>
          </div>
          <button
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 mb-2"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancelar' : 'Deixar minha review'}
          </button>
          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="w-full mt-2">
              {/* Estrelinhas para voto do usuário */}
              <div className="flex items-center space-x-2 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRateClick(star)}
                    className={`text-2xl transition duration-200 ${star <= userRating ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
                  >
                    ★
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">({userRating}/5)</span>
              </div>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={4}
                required
                placeholder="Sua review..."
                value={userReview}
                onChange={e => setUserReview(e.target.value)}
              />
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
        {/* Direita: Review do criador no topo, lista de reviews abaixo */}
        <div className="flex flex-col col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Reviews dos usuários</h3>
            {/* Lista de reviews de outros usuários */}
            <ul className="space-y-6">
              {
                reviews?.map(review => (
                  <li className="border-b pb-6" key={review.id}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-3">
                          <img
                            src={review?.user?.profile_photo ? process.env.REACT_APP_API_URL + '/' + review?.user?.profile_photo.path + '/' + review?.user?.profile_photo.name   : 'https://via.placeholder.com/40x40/6366f1/ffffff?text=U'}
                            alt={review?.user?.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div
                            /* to={`/profile/${review?.user?.id}`} */
                            className="font-medium text-indigo-600 hover:text-indigo-800"
                          >
                            {review?.user?.name}
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[1,2,3,4,5].map(star => (
                            <span
                              key={star}
                              className={`text-sm ${star <= review.rate ? 'text-yellow-400' : 'text-gray-300'}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {review.created_at ? new Date(review.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : ''}
                      </span>
                    </div>
                    <p className="text-gray-600">{review?.review}</p>
                  </li>
                ))
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails; 