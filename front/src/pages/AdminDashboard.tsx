import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [dashData, setDashData] = useState<any>(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      await axios.get(process.env.REACT_APP_API_URL + '/api/admin-dashboard', {
        headers: {
          Authorization: 'Bearer ' + token
        }
      })
        .then(res => setDashData(res.data))
        .catch(() => navigate('/dashboard'));
    };
    getData();
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const users = [
    { id: 1, name: 'Gabriel Müller', email: 'gabriel@example.com', role: 'Admin', created_at: '2025' },
    { id: 2, name: 'Joana Silva', email: 'joana@example.com', role: 'User', created_at: '2025' },
    { id: 3, name: 'Carlos Souza', email: 'carlos@example.com', role: 'User', created_at: '2025' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-8">
      <div className="container mx-auto px-4 py-8 flex flex-col gap-5">
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-gray-900">Usuários</h1>
          <table className="w-full bg-white rounded-2xl shadow-xl p-8 mb-8">
            <thead>
              <tr className="bg-white text-left text-gray-700 uppercase text-sm">
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Função</th>
                <th className="px-6 py-3">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {dashData?.users?.map((user: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{user.name}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.role}</td>
                  <td className="px-6 py-4">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-gray-900">Filmes</h1>
          <table className="w-full bg-white rounded-2xl shadow-xl p-8 mb-8">
            <thead>
              <tr className="bg-white text-left text-gray-700 uppercase text-sm">
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Categoria</th>
                <th className="px-6 py-3">Ano</th>
                <th className="px-6 py-3">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {dashData?.movies?.map((movie: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{movie.title}</td>
                  <td className="px-6 py-4">{movie.category}</td>
                  <td className="px-6 py-4">{movie.release_date}</td>
                  <td className="px-6 py-4">{formatDate(movie.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-6">
          <h1 className="text-xl font-bold text-gray-900">Reviews</h1>
          <table className="w-full bg-white rounded-2xl shadow-xl p-8 mb-8">
            <thead>
              <tr className="bg-white text-left text-gray-700 uppercase text-sm">
                <th className="px-6 py-3">E-mail</th>
                <th className="px-6 py-3">Título</th>
                <th className="px-6 py-3">Review</th>
                <th className="px-6 py-3">Nota</th>
                <th className="px-6 py-3">Cadastrado em</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {dashData?.reviews?.map((review: any) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">{review.user.email}</td>
                  <td className="px-6 py-4">{review.movie.title}</td>
                  <td className="px-6 py-4">{review.review}</td>
                  <td className="px-6 py-4">{renderStars(review.rate)}</td>
                  <td className="px-6 py-4">{formatDate(review.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 