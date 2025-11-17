import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface MovieFormData {
  title: string;
  category: string;
  releaseDate: string;
  coverImage?: string;
  movieId?: string;
  image?: string;
  type: string;
}

const AddMovie: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);
  const [formData, setFormData] = useState<MovieFormData>({
    title: '',
    category: '',
    releaseDate: '',
    movieId: '',
    image: '',
    type: 'movie'
  });
  const MySwal = withReactContent(Swal)
  const coverImageRef = useRef<HTMLInputElement>(null);
  const [movieSuggestions, setMovieSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [foundMovies, setFoundMovies] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get(process.env.REACT_APP_API_URL + `/api/get-${formData.type}-genres`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });

      setCategories(res.data);
    };
    fetchCategories();
  }, [formData.type]);

  const handleTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));

    if(e.target.value.length >= 3) {
      await axios.post(process.env.REACT_APP_API_URL + '/api/search-content', {
        search: e.target.value,
        type: formData.type
      }, 
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(res => {
        setFoundMovies(res.data.results);
      });

      setShowSuggestions(true);
    }    
  };

  const handleSuggestionClick = (movie: any) => {
    setFormData(prev => ({
      ...prev,
      movieId: movie.id,
      title: movie.title,
      category: movie.category || '',
      releaseDate: movie.release_date || '',
      coverImage: process.env.REACT_APP_API_URL + '/' + movie.cover.path + '/' + movie.cover.name || '',
      image: movie.poster_path || '',
    }));

    setShowSuggestions(false);
    if (movie.coverImage) {
      setImageFile(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      title: '',
      category: '',
      releaseDate: '',
      movieId: '',
      type: '',
      image: ''
    });

    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    setFoundMovies([])
  };

  const handleReleaseDateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (rating: number) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleImageUpload = (file: File) => {
    const maxSizeInBytes = 1 * 1024 * 1024;

    if (!file.type.startsWith("image/")) {
      MySwal.fire({
        title: <p>Aviso</p>,
        text: "Apenas arquivos de imagem são permitidos.",
        icon: "warning",
      })
      return;
    }

    if (file.size > maxSizeInBytes) {
      MySwal.fire({
        title: <p>Aviso</p>,
        text: "A imagem deve ter no máximo 1MB.",
        icon: "warning",
      })

      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverImageClick = () => {
    if (coverImageRef.current) {
      coverImageRef.current.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadData = {
        title: formData.title,
        category: formData.category,
        releaseDate: formData.releaseDate,
        userId: user?.id,
        image: formData.image,
        type: formData.type
      }

      await axios.post(process.env.REACT_APP_API_URL + '/api/create-movie', uploadData, {
        headers: {
          "Content-Type": 'application/json',
          Authorization: 'Bearer ' + token
        }
      }).then(res => {
        setFormData({
          title: '',
          category: '',
          releaseDate: '',
          type: 'movie',
          image: ''
        });
  
        MySwal.fire({
          title: <p>Sucesso</p>,
          text: "Review cadastrada com sucesso!",
          icon: "success"
        })
      })
    } catch (error) {
      MySwal.fire({
        title: <p>Algo deu errado</p>,
        text: "Erro ao cadastrar filme. Tente novamente.",
        icon: "error"
      })
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMovieSelect = (movie: any, i: number) => {
    setFormData(prev => ({
      ...prev,
      movieId: movie.id,
      title: formData.type === 'movie' ? movie.title : movie.name,
      category: movie.genre_ids[0] || '',
      releaseDate: formData.type === 'movie' ? movie?.release_date?.split('-')[0] : movie?.first_air_date?.split('-')[0],
      coverImage: '',
      image: formData.type === 'movie' ? 'https://image.tmdb.org/t/p/w200' + movie?.poster_path : 'https://image.tmdb.org/t/p/w200' + movie?.poster_path,
    }));

    let moviesDiv = document.querySelectorAll('#movie-opt');
    
    moviesDiv.forEach((item: any) => {
      item.classList.remove('border-indigo-500');
      item.classList.remove('bg-indigo-100');
      item.classList.remove('border-2');
      item.classList.remove('border-dashed');
      item.classList.remove('border-gray-300');
      item.classList.remove('rounded-lg');
      item.classList.remove('shadow-lg');
      item.classList.remove('shadow-indigo-500');
    });
    
    document.querySelectorAll('#movie-opt')[i]?.classList.add('bg-indigo-100');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('border-indigo-500');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('border-2');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('border-dashed');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('border-gray-300');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('rounded-lg');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('shadow-lg');
    document.querySelectorAll('#movie-opt')[i]?.classList.add('shadow-indigo-500');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Cadastrar Novo Filme
          </h1>
          <p className="text-gray-600">
            Compartilhe sua experiência cinematográfica com a comunidade
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Você quer cadastrar filme ou série?
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="movie"
                    name="type"
                    value="movie"
                    checked={formData.type === 'movie'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="movie" className="ml-2 text-sm font-medium text-gray-700">
                    Filme
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="tv"
                    name="type"
                    value="tv"
                    checked={formData.type === 'tv'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="series" className="ml-2 text-sm font-medium text-gray-700">
                    Série
                  </label>
                </div>
              </div>
            </div>

            <div className="relative">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                autoComplete="off"
                value={formData.title}
                onChange={handleTitleChange}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="Ex: O Poderoso Chefão"
              />
              {showSuggestions && movieSuggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-56 overflow-y-auto shadow-lg">
                  {movieSuggestions.map((movie) => (
                    <li
                      key={movie.id}
                      className="px-4 py-2 cursor-pointer hover:bg-indigo-100"
                      onMouseDown={() => handleSuggestionClick(movie)}
                    >
                      {movie.title} <span className="text-xs text-gray-500">({movie.category})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className='grid grid-cols-4 gap-4 align-top'>
              {
                foundMovies?.map((movie, i) => (
                  <div id='movie-opt' key={movie.id} onClick={() => handleMovieSelect(movie, i)} className='text-center flex flex-col items-center justify-start cursor-pointer hover:scale-105 transition-all max-w-[150px] max-h-[250px] duration-300 whitespace-normal'>
                    <img width={100} src={'https://image.tmdb.org/t/p/w200' + movie.poster_path} alt={'teste'} />
                    <span>{ formData.type === 'movie' ? movie.title : movie.name}</span>
                  </div>
                ))
              }
            </div>

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                required
                value={categories.find(category => category.tmdb_id === formData.category)?.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                disabled={true}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category.tmdb_id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 mb-2">
                Ano de lançamento *
              </label>
              <input
                type="text"
                id="releaseDate"
                name="releaseDate"
                required
                value={formData.releaseDate}
                onChange={handleReleaseDateChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                placeholder="2025"
              />
            </div>

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
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Cadastrando...
                  </div>
                ) : (
                  'Cadastrar Filme'
                )}
              </button>
            </div>
          </form>

          {/* Hidden file input */}
          <input
            ref={coverImageRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default AddMovie; 