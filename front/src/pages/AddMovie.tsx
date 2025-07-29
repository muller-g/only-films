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
    movieId: ''
  });
  const MySwal = withReactContent(Swal)
  const coverImageRef = useRef<HTMLInputElement>(null);
  const [movieSuggestions, setMovieSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Busca filmes existentes conforme o título digitado
  useEffect(() => {
    const fetchMovies = async () => {
      if (formData.title.length < 3 || formData.title.length % 3 !== 0) {
        setMovieSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(process.env.REACT_APP_API_URL + '/api/search-movies?title=' + encodeURIComponent(formData.title), {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        setMovieSuggestions(res.data);
      } catch {
        setMovieSuggestions([]);
      }
    };
    fetchMovies();
  }, [formData.title]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, title: e.target.value }));
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (movie: any) => {
    setFormData(prev => ({
      ...prev,
      movieId: movie.id,
      title: movie.title,
      category: movie.category || '',
      releaseDate: movie.release_date || '',
      coverImage: process.env.REACT_APP_API_URL + '/' + movie.cover.path + '/' + movie.cover.name || '',
    }));
    setShowSuggestions(false);
    if (movie.coverImage) {
      setImageFile(null);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      let uploadData = new FormData;
      let contentType = 'multipart/form-data'

      if(formData.movieId !== ''){

        MySwal.fire({
          title: <p>Aviso</p>,
          text: "Filme ja existe na base de dados.",
          icon: "warning",
        }).then(() => {
          setFormData(prev => ({
              ...prev,
              title: '',
              category: '',
              releaseDate: '',
              coverImage: '',
            }));

            setImageFile(null);
        });

        return;
      }

      uploadData.append('title', formData.title)
      uploadData.append('category', formData.category)
      uploadData.append('releaseDate', formData.releaseDate)
      uploadData.append('userId', user?.id)
      uploadData.append('coverPhoto', imageFile)

      await axios.post(process.env.REACT_APP_API_URL + '/api/create-movie', uploadData, {
        headers: {
          "Content-Type": contentType,
          Authorization: 'Bearer ' + token
        }
      }).then(res => {
        setFormData({
          title: '',
          category: '',
          releaseDate: ''
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

  const categories = [
    'Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica',
    'Terror', 'Romance', 'Suspense', 'Documentário', 'Animação',
    'Fantasia', 'Crime', 'Guerra', 'Western', 'Musical'
  ];

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
            {/* Foto de Capa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto de Capa
              </label>
              <div 
                className="relative w-full h-48 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-indigo-400 transition duration-200"
                onClick={handleCoverImageClick}
              >
                {formData.coverImage ? (
                  <div className="relative w-full h-full">
                    <img
                      src={formData.coverImage}
                      alt="Capa do filme"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition duration-200">
                      <div className="text-white opacity-0 hover:opacity-100 transition duration-200">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Alterar imagem</p>
                      </div>
                    </div>
                  </div>
                ) : imageFile ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Capa do filme"
                      className="w-full h-full object-contain rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 flex items-center justify-center transition duration-200">
                      <div className="text-white opacity-0 hover:opacity-100 transition duration-200">
                        <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Alterar imagem</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">Clique para adicionar uma foto de capa</p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG até 1MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Título do Filme */}
            <div className="relative">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título do Filme *
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

            {/* Categoria */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
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