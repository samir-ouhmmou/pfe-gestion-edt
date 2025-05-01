import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, School, Settings, ArrowRight } from 'lucide-react';
import Header from '../Components/common/Header';
import Footer from '../Components/common/Footer';

const HomePage = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-lime-600" />,
      title: "Génération Automatique",
      description: "Création automatique des emplois du temps en tenant compte de toutes les contraintes.",
    },
    {
      icon: <Users className="h-10 w-10 text-lime-600" />,
      title: "Gestion des Enseignants",
      description: "Interface dédiée pour la gestion des disponibilités et des absences des professeurs.",
    },
    {
      icon: <School className="h-10 w-10 text-lime-600" />,
      title: "Gestion des Classes",
      description: "Organisation optimale des emplois du temps par niveau et par classe.",
    },
    {
      icon: <Settings className="h-10 w-10 text-lime-600" />,
      title: "Administration Facile",
      description: "Tableau de bord intuitif pour les administrateurs avec toutes les fonctionnalités nécessaires.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 lg:pt-28 pb-16 bg-gradient-to-br from-gray-300 to-gray-90 text-noir">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center">
            <motion.div
              className="lg:w-1/2 mb-10 lg:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                Nawabigh application de gestion des emplois du temps
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                La solution complète pour organiser efficacement les emplois du temps de votre école primaire.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/timetable"
                  className="px-6 py-3 bg-lime-500 text-white  font-medium rounded-lg flex items-center justify-center hover:bg-lime-600 transition-colors"
                >
                  Consulter l'emploi du temps
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="px-6 py-3 bg-transparent border-2 bg-white border-gray- text-noir font-medium rounded-lg flex items-center justify-center hover:bg-gray-400 transition-colors"
                >
                  En savoir plus
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <img
                src="/cal.png"
                alt="Élèves à l'école"
                loading="lazy"
                className="rounded-lg w-full h-auto max-h-92 object-cover transform transition-transform duration-300 hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Notre système offre tout ce dont vous avez besoin pour gérer efficacement les emplois du temps de votre école.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-gray-100 rounded-xl p-8 md:p-12 shadow-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-noir mb-6">
                Prêt à simplifier la gestion de vos emplois du temps?
              </h2>
              <p className="text-lg text-gray-500 mb-8">
                Consultez les emplois du temps ou connectez-vous pour accéder à toutes les fonctionnalités.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/timetable"
                  className="px-6 py-3 bg-lime-500 text-white font-medium rounded-lg hover:bg-lime-600 transition-colors">
                  Consulter les emplois du temps
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3 bg-transparent border-2 border-gray-300  bg-gray-500 text-noir font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
