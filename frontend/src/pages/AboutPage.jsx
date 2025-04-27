import { motion } from 'framer-motion';
import Header from '../Components/common/Header';
import Footer from '../Components/common/Footer';
import { CheckCircle, Clock, Download, Calendar, Users, Flag } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gray-200 ">
          <div className="container mx-auto px-4">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl font-bold mb-6">À Propos de SchoolTimetable</h1>
              <p className="text-xl text-gray-600">
                Découvrez notre solution innovante pour la gestion automatique des emplois du temps dans les écoles primaires.
              </p>
            </motion.div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">Notre Mission</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Notre mission est de simplifier la gestion des emplois du temps scolaires en proposant une solution automatisée, 
                  intuitive et flexible qui répond aux besoins spécifiques des écoles primaires.
                </p>
                <p className="text-lg text-gray-700 mb-6">
                  Nous visons à réduire le temps consacré à la planification des emplois du temps, 
                  permettant ainsi aux équipes administratives et aux enseignants de se concentrer sur leur mission première : 
                  offrir une éducation de qualité aux élèves.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8">
                  <div className="flex items-center">
                    <Flag className="h-10 w-10 text-green-600 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Fondée en</h3>
                      <p className="text-gray-700">2025</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-10 w-10 text-green-700 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Écoles utilisatrices</h3>
                      <p className="text-gray-700">2+</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-10 w-10 text-green-700 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Emplois du temps créés</h3>
                      <p className="text-gray-700">10+</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Fonctionnalités Principales</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Notre application offre une solution complète pour la gestion des emplois du temps.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Calendar className="h-10 w-10 text-green-700" />,
                  title: "Génération Automatique",
                  description: "Création automatique des emplois du temps en tenant compte de toutes les contraintes et préférences."
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-green-700" />,
                  title: "Gestion des Ressources",
                  description: "Allocation optimale des salles et gestion efficace des disponibilités des enseignants."
                },
                {
                  icon: <Users className="h-10 w-10 text-green-700" />,
                  title: "Gestion des Enseignants",
                  description: "Interface dédiée pour la gestion des disponibilités et des absences des professeurs."
                },
                {
                  icon: <Clock className="h-10 w-10 text-green-700" />,
                  title: "Ajustements en Temps Réel",
                  description: "Modification facile des emplois du temps avec mise à jour instantanée pour tous les utilisateurs."
                },
                {
                  icon: <Download className="h-10 w-10 text-green-700" />,
                  title: "Export Facile",
                  description: "Exportation des emplois du temps en PDF pour un partage et une diffusion simplifiés."
                },
                {
                  icon: <CheckCircle className="h-10 w-10 text-green-700" />,
                  title: "Tableau de Bord Intuitif",
                  description: "Interface administrateur claire et intuitive pour une gestion efficace des données."
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md"
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
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Les Avantages</h2>
                <p className="text-lg text-gray-600">
                  Notre solution offre de nombreux avantages pour les écoles, les enseignants et les élèves.
                </p>
              </motion.div>
              
              <div className="space-y-6">
                {[
                  {
                    title: "Gain de Temps Considérable",
                    description: "Réduit le temps consacré à la planification des emplois du temps de plusieurs semaines à quelques heures."
                  },
                  {
                    title: "Optimisation des Ressources",
                    description: "Assure une utilisation optimale des salles de classe et respecte les contraintes des enseignants."
                  },
                  {
                    title: "Réduction des Erreurs",
                    description: "Élimine les chevauchements et les erreurs d'affectation courants dans la planification manuelle."
                  },
                  {
                    title: "Flexibilité Accrue",
                    description: "Permet des ajustements rapides en cas d'imprévus comme les absences d'enseignants."
                  },
                  {
                    title: "Meilleure Communication",
                    description: "Facilite la diffusion des emplois du temps à toutes les parties prenantes."
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <CheckCircle className="h-6 w-6 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-200">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl mx-auto">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Prêt à optimiser la gestion de vos emplois du temps?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Notre application vous permet de gagner du temps et d'améliorer l'organisation de votre école.
                  Consultez les emplois du temps ou connectez-vous en tant qu'administrateur pour accéder à toutes les fonctionnalités.
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <a
                    href="/timetable"
                    className="px-6 py-3 bg-lime-500 text-white font-medium rounded-lg hover:bg-lime-600 transition-colors"
                  >
                    Consulter les emplois du temps
                  </a>
                  <a
                    href="/login"
                    className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Se connecter
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;