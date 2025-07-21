import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

interface ProfileData {
  id: string;
  name: string;
  email: string;
  favoriteGenres: string[];
  notifications: {
    email: boolean;
    push: boolean;
    reviews: boolean;
  };
  profileImage?: string;
}

const Profile: React.FC = () => {
  const MySwal = withReactContent(Swal)
  const { user, token } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFile, setImageFile] = useState<any>(null);
  const [profilePhoto, setProfilePhoto] = useState<any>();

  const [profileData, setProfileData] = useState<ProfileData>({
    id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    favoriteGenres: ['Drama', 'Ação', 'Ficção Científica'],
    notifications: {
      email: true,
      push: false,
      reviews: true
    },
    profileImage: 'https://via.placeholder.com/150x150/6366f1/ffffff?text=CR'
  });

  const profileImageRef = useRef<HTMLInputElement>(null);

  const availableGenres = [
    'Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica',
    'Terror', 'Romance', 'Suspense', 'Documentário', 'Animação',
    'Fantasia', 'Crime', 'Guerra', 'Western', 'Musical'
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setProfileData(prev => ({
      ...prev,
      favoriteGenres: prev.favoriteGenres.includes(genre)
        ? prev.favoriteGenres.filter(g => g !== genre)
        : [...prev.favoriteGenres, genre]
    }));
  };

  const handleNotificationChange = (key: keyof ProfileData['notifications']) => {
    setProfileData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleProfileImageClick = () => {
    if (isEditing && profileImageRef.current) {
      profileImageRef.current.click();
    }
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      
      let formData = new FormData;
      formData.append('id', profileData.id)
      formData.append('name', profileData.name)
      formData.append('email', profileData.email)
      
      if(typeof imageFile === 'object'){
        formData.append('coverPhoto', imageFile)
      }

      await axios.post(process.env.REACT_APP_API_URL + '/api/profile-update', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: 'Bearer ' + token
        }
      }).then(res => {
        console.log(imageFile)
        setProfileData({
          id: user?.id || '',
          name: user?.name || '',
          email: user?.email || '',
          favoriteGenres: ['Drama', 'Ação', 'Ficção Científica'],
          notifications: {
            email: true,
            push: false,
            reviews: true
          },
          profileImage: imageFile ? URL.createObjectURL(imageFile) : profilePhoto
        });
  
        MySwal.fire({
          title: <p>Sucesso</p>,
          text: "Perfil atualizado com sucesso!",
          icon: "success"
        })
      })

      
      setIsEditing(false);
    } catch (error) {
      MySwal.fire({
        title: <p>Algo deu errado</p>,
        text: "Erro ao atualizar perfil. Tente novamente.",
        icon: "error"
      })
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Restaura dados originais
    setProfileData({
      id: user?.id || '',
      name: user?.name || '',
      email: user?.email || '',
      favoriteGenres: ['Drama', 'Ação', 'Ficção Científica'],
      notifications: {
        email: true,
        push: false,
        reviews: true
      },
      profileImage: 'https://via.placeholder.com/150x150/6366f1/ffffff?text=CR'
    });
    setIsEditing(false);
  };

  useEffect(() => {
    const getProfile = async () => {
      await axios.get(process.env.REACT_APP_API_URL + '/api/profile/' + user?.id, {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }).then(res => {
        setProfilePhoto(process.env.REACT_APP_API_URL + '/' + res.data.profile_photo.path + '/' + res.data.profile_photo.name)
        setProfileData({
          id: res.data.id || '',
          name: res.data.name || '',
          email: res.data.email || '',
          favoriteGenres: ['Drama', 'Ação', 'Ficção Científica'],
          notifications: {
            email: true,
            push: false,
            reviews: true
          },
          profileImage: process.env.REACT_APP_API_URL + '/' + res.data.profile_photo.path + '/' + res.data.profile_photo.name  
        });
      }).catch(res => {
        return null
      })
    }

    getProfile();
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Image - Topo da página */}
        <div className="flex justify-center mb-8">
          <div 
            className={`relative ${isEditing ? 'cursor-pointer' : ''}`}
            onClick={handleProfileImageClick}
          >
            <img
              src={imageFile ? URL.createObjectURL(imageFile) : typeof imageFile === 'string' ? imageFile : profileData.profileImage}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-60 transition duration-200">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Meu Perfil
              </h1>
              <p className="text-gray-600">
                Gerencie suas informações pessoais e preferências
              </p>
            </div>
            <div className="flex space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                  >
                    {isSaving ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                >
                  Editar Perfil
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={profileImageRef}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImageUpload(file);
          }}
          className="hidden"
        />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dados Básicos */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Informações Pessoais</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{profileData.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Gêneros Favoritos */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Gêneros Favoritos</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableGenres.map(genre => (
                  <button
                    key={genre}
                    onClick={() => isEditing && handleGenreToggle(genre)}
                    disabled={!isEditing}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${
                      profileData.favoriteGenres.includes(genre)
                        ? 'bg-indigo-100 text-indigo-700 border-2 border-indigo-200'
                        : 'bg-gray-100 text-gray-600 border-2 border-gray-200'
                    } ${
                      isEditing ? 'hover:bg-indigo-50 cursor-pointer' : 'cursor-default'
                    }`}
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Estatísticas */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Estatísticas</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reviews Publicadas</span>
                  <span className="text-2xl font-bold text-indigo-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Filmes Avaliados</span>
                  <span className="text-2xl font-bold text-green-600">45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membro desde</span>
                  <span className="text-sm text-gray-500">Jan 2024</span>
                </div>
              </div>
            </div>

            {/* Notificações */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notificações</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">Receber notificações por email</p>
                  </div>
                  <button
                    onClick={() => isEditing && handleNotificationChange('email')}
                    disabled={!isEditing}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileData.notifications.email ? 'bg-indigo-600' : 'bg-gray-200'
                    } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push</p>
                    <p className="text-sm text-gray-600">Notificações no navegador</p>
                  </div>
                  <button
                    onClick={() => isEditing && handleNotificationChange('push')}
                    disabled={!isEditing}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileData.notifications.push ? 'bg-indigo-600' : 'bg-gray-200'
                    } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Reviews</p>
                    <p className="text-sm text-gray-600">Novos reviews de filmes</p>
                  </div>
                  <button
                    onClick={() => isEditing && handleNotificationChange('reviews')}
                    disabled={!isEditing}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      profileData.notifications.reviews ? 'bg-indigo-600' : 'bg-gray-200'
                    } ${isEditing ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        profileData.notifications.reviews ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 