import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Gerencie seus filmes e reviews
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-200"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            to="/add-review"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cadastrar Review</h3>
            <p className="text-gray-600">
              Adicione uma nova review de um filme que você assistiu
            </p>
          </Link>

          <Link
            to="/add-movie"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-teal-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4h16v16H4V4zm4 0v4m0 4v4m8-8v4m0 4v4M4 8h16M4 16h16"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cadastrar Filme</h3>
            <p className="text-gray-600">
              Cadastre um novo filme para review
            </p>
          </Link>

          <Link
            to="/my-reviews"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Meus Reviews</h3>
            <p className="text-gray-600">
              Visualize todos os seus reviews
            </p>
          </Link>

          <Link
            to="/profile"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Perfil</h3>
            <p className="text-gray-600">
              Gerencie suas informações pessoais
            </p>
          </Link>

          <Link
            to="/all-reviews"
            className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Todos os Filmes</h3>
            <p className="text-gray-600">
              Veja todos os filmes cadastrados na comunidade
            </p>
          </Link>
          {
            user?.role === "admin" &&
            <Link
              to="/admin-dashboard"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-300 transform hover:scale-105"
            >
              <div className="w-12 h-12 bg-red-300 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-4 4h8a2 2 0 002-2v-6a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2zm8-10V7a4 4 0 10-8 0v4h8z"
                />
              </svg>

              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Painel Admin</h3>
              <p className="text-gray-600">
                Informações sobre o sistema
              </p>
            </Link>
          }
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Atividade Recente</h2>
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 mb-4">Nenhuma atividade recente</p>
            <Link
              to="/add-movie"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Cadastrar Primeiro Filme
            </Link>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard; 