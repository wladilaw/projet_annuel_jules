'use client'

import Link from 'next/link'
import { SparklesIcon, DocumentTextIcon, UserGroupIcon, ArrowRightIcon, CheckIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const features = [
  {
    name: 'IA Avancée',
    description: 'Notre intelligence artificielle analyse votre profil et l\'offre d\'emploi pour créer des lettres parfaitement adaptées.',
    icon: SparklesIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    name: 'Personnalisation',
    description: 'Chaque lettre est unique et personnalisée selon vos compétences et l\'entreprise ciblée.',
    icon: DocumentTextIcon,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    name: 'Résultats Prouvés',
    description: 'Nos utilisateurs obtiennent 3x plus d\'entretiens grâce à nos lettres optimisées.',
    icon: UserGroupIcon,
    gradient: 'from-green-500 to-emerald-500'
  }
]

const stats = [
  { name: 'Lettres générées', value: '50,000+' },
  { name: 'Taux de réussite', value: '94%' },
  { name: 'Utilisateurs actifs', value: '10,000+' },
  { name: 'Entreprises partenaires', value: '500+' }
]

const testimonials = [
  {
    content: "Grâce à cette plateforme, j'ai décroché mon emploi de rêve en seulement 2 semaines !",
    author: "Marie Dubois",
    role: "Développeuse Frontend",
    avatar: "MD"
  },
  {
    content: "L'IA comprend parfaitement les attentes des recruteurs. Mes candidatures ont un taux de réponse incroyable.",
    author: "Thomas Martin",
    role: "Chef de Projet",
    avatar: "TM"
  },
  {
    content: "Interface intuitive et résultats exceptionnels. Je recommande vivement !",
    author: "Sophie Laurent",
    role: "Marketing Manager",
    avatar: "SL"
  }
]

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="nav-modern">
        <div className="container-modern">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div 
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-3">
                <span className="text-xl font-bold text-gradient">
                  LM AI
                </span>
                <div className="text-xs text-gray-500">Lettres Intelligentes</div>
              </div>
            </motion.div>

            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Fonctionnalités
              </Link>
              <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">
                Témoignages
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Tarifs
              </Link>
            </div>

            {/* Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/auth/login" className="btn btn-ghost">
                Se connecter
              </Link>
              <Link href="/auth/register" className="btn btn-primary">
                Commencer
              </Link>
            </div>

            {/* Menu mobile */}
            <button
              className="md:hidden p-2 rounded-lg text-gray-400 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass border-t border-gray-200"
            >
              <div className="container-modern py-4 space-y-4">
                <Link href="#features" className="block text-gray-600 hover:text-gray-900">
                  Fonctionnalités
                </Link>
                <Link href="#testimonials" className="block text-gray-600 hover:text-gray-900">
                  Témoignages
                </Link>
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  <Link href="/auth/login" className="btn btn-ghost w-full">
                    Se connecter
                  </Link>
                  <Link href="/auth/register" className="btn btn-primary w-full">
                    Commencer
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden section-padding">
        {/* Background Pattern */}
        <div className="absolute inset-0 hero-pattern opacity-10"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full opacity-20 animate-float" style={{animationDelay: '2s'}}></div>

        <div className="container-modern relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="text-gradient">Lettres de motivation</span>
                <br />
                <span className="text-gray-900">qui font la différence</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
                Créez des lettres personnalisées et percutantes grâce à notre IA avancée. 
                <br className="hidden md:block" />
                Maximisez vos chances de décrocher l'emploi de vos rêves.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link href="/auth/register" className="btn btn-primary text-lg px-8 py-4 animate-pulse-glow">
                  <SparklesIcon className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                </Link>
                <Link href="#features" className="btn btn-ghost text-lg px-8 py-4">
                  Voir les fonctionnalités
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container-modern">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="stat-value text-gradient">{stat.value}</div>
                <div className="stat-label">{stat.name}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding" id="features">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Pourquoi choisir notre plateforme ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les fonctionnalités qui font de notre outil la référence 
              pour créer des lettres de motivation exceptionnelles.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-8 hover-lift hover-glow text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.name}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-padding bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Comment ça marche ?
            </h2>
            <p className="text-xl text-gray-600">
              Trois étapes simples pour des lettres parfaites
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Téléchargez votre CV",
                description: "Notre IA analyse automatiquement vos compétences, expériences et qualifications pour comprendre votre profil unique."
              },
              {
                step: "02", 
                title: "Ajoutez l'offre d'emploi",
                description: "Collez simplement le lien ou le texte de l'offre. Notre système identifie les mots-clés et exigences importantes."
              },
              {
                step: "03",
                title: "Obtenez votre lettre",
                description: "Recevez une lettre personnalisée et optimisée que vous pouvez modifier, télécharger et envoyer immédiatement."
              }
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="card p-8">
                  <div className="text-6xl font-bold text-gradient mb-4">{item.step}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8">
                    <ArrowRightIcon className="w-8 h-8 text-gray-300" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding" id="testimonials">
        <div className="container-modern">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ce que disent nos utilisateurs
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de ceux qui ont transformé leur recherche d'emploi
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-gray-600 italic leading-relaxed">"{testimonial.content}"</p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding hero-gradient hero-pattern">
        <div className="container-modern text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à transformer votre recherche d'emploi ?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Rejoignez des milliers de professionnels qui ont déjà boosté leur carrière 
              grâce à nos lettres de motivation intelligentes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" className="btn bg-white text-gray-900 hover:bg-gray-100 text-lg px-8 py-4">
                <CheckIcon className="w-5 h-5 mr-2" />
                Commencer maintenant
              </Link>
              <Link href="/auth/login" className="btn btn-ghost border-white text-white hover:bg-white/10 text-lg px-8 py-4">
                Se connecter
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container-modern">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center mr-3">
                  <SparklesIcon className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold">LM AI</span>
              </div>
              <p className="text-gray-400">
                La plateforme de référence pour créer des lettres de motivation intelligentes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produit</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Fonctionnalités</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Tarifs</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Centre d'aide</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Statut</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Conditions</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 LM AI. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
