import { useState } from 'react';
import { Figma, Share2, Users } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import JoinProjectModal from '../components/JoinProjectModal';
import socket from '../services/socketServices';

const Home = () => {
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleNewProject = () => {
    socket.emit('create-project', (response: { projectId: string; secretKey: string }) => {
      console.log("despues de la creacion", response.projectId, response.secretKey);
      if (response.projectId && response.secretKey) {
        navigate(`/canvas?projectId=${response.projectId}&key=${response.secretKey}`);
      } else {
        console.error("Error al crear el proyecto");
      }
    });
  };

  const handleJoinProject = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 pt-16"> {/* Añade pt-16 para espacio debajo del Navbar fijo */}
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-16 md:py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Diseña <span className="text-indigo-600">juntos</span> en tiempo real
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Crea interfaces, comparte ideas y colabora con tu equipo en un lienzo interactivo.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleNewProject}
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium flex items-center justify-center"
            >
              Crear nuevo proyecto
            </button>
            <a
              className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition font-medium"
              onClick={handleJoinProject}
            >
              Unirse a proyecto existente
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Características principales</h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Colaboración en vivo</h3>
                <p className="text-gray-600">
                  Todos los cambios se sincronizan instantáneamente entre los miembros del equipo.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Share2 className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Comparte fácilmente</h3>
                <p className="text-gray-600">
                  Invita a otros con un simple enlace. Controla quién puede editar.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-gray-50 p-6 rounded-xl hover:shadow-md transition">
                <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Figma className="text-indigo-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Herramientas profesionales</h3>
                <p className="text-gray-600">
                  Formas, texto, capas y todas las herramientas que necesitas para diseñar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-indigo-600 text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">¿Listo para empezar a diseñar?</h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Únete a miles de diseñadores que ya están creando proyectos increíbles.
            </p>
            <button
              onClick={handleNewProject}
              className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              Comenzar ahora - ¡Es gratis!
            </button>
          </div>
        </section>
        <JoinProjectModal
          visible={isModalVisible}
          onCancel={handleModalCancel}
        />
        {/* Footer */}
        <footer className="py-8 border-t border-gray-200">
          <div className="container mx-auto px-6 text-center text-gray-500">
            <div className="flex justify-center space-x-6 mb-4">
              <a href="#" className="hover:text-indigo-600">Términos</a>
              <a href="#" className="hover:text-indigo-600">Privacidad</a>
            </div>
            <p>© {new Date().getFullYear()} DesignCollab. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;