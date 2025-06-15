'use client'

import { 
  DocumentTextIcon, 
  BriefcaseIcon, 
  EnvelopeIcon,
  PlusIcon,
  ArrowUpIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { motion } from 'framer-motion'

const stats = [
  { 
    name: 'CV téléchargés', 
    value: '2', 
    change: '+1', 
    changeType: 'increase',
    icon: DocumentTextIcon,
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    name: 'Offres sauvegardées', 
    value: '12', 
    change: '+3', 
    changeType: 'increase',
    icon: BriefcaseIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    name: 'Lettres générées', 
    value: '8', 
    change: '+2', 
    changeType: 'increase',
    icon: EnvelopeIcon,
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    name: 'Taux de réussite', 
    value: '94%', 
    change: '+5%', 
    changeType: 'increase',
    icon: ArrowTrendingUpIcon,
    gradient: 'from-orange-500 to-red-500'
  },
]

const quickActions = [
  {
    name: 'Télécharger un CV',
    description: 'Ajoutez votre CV pour commencer',
    href: '/cv',
    icon: DocumentTextIcon,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50'
  },
  {
    name: 'Rechercher des offres',
    description: 'Trouvez votre prochain emploi',
    href: '/offers',
    icon: BriefcaseIcon,
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50'
  },
  {
    name: 'Créer une lettre',
    description: 'Générez une lettre personnalisée',
    href: '/letters/new',
    icon: EnvelopeIcon,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50'
  },
]

const recentActivity = [
  { 
    action: 'CV téléchargé', 
    time: 'Il y a 2 heures',
    icon: DocumentTextIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  { 
    action: 'Offre sauvegardée chez Google', 
    time: 'Il y a 1 jour',
    icon: BriefcaseIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  { 
    action: 'Lettre générée pour Apple', 
    time: 'Il y a 2 jours',
    icon: EnvelopeIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
]

const achievements = [
  {
    title: 'Premier CV téléchargé',
    description: 'Félicitations ! Vous avez franchi la première étape.',
    icon: CheckCircleIcon,
    completed: true
  },
  {
    title: 'Première lettre générée',
    description: 'Créez votre première lettre de motivation.',
    icon: SparklesIcon,
    completed: false
  },
  {
    title: 'Expert en candidatures',
    description: 'Générez 10 lettres de motivation.',
    icon: ArrowTrendingUpIcon,
    completed: false
  }
]

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="container-modern space-y-8">
        {/* En-tête avec animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center lg:text-left"
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Bonjour ! 👋
          </h1>
          <p className="text-xl text-gray-600">
            Prêt à créer des lettres de motivation qui font la différence ?
          </p>
        </motion.div>

        {/* Statistiques avec animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="stat-card hover-lift hover-glow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${item.gradient} flex items-center justify-center`}>
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <div className={`stat-change ${item.changeType === 'increase' ? 'positive' : 'negative'}`}>
                  <ArrowUpIcon className="w-4 h-4" />
                  {item.change}
                </div>
              </div>
              <div className="stat-value">{item.value}</div>
              <div className="stat-label">{item.name}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Actions rapides */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Actions rapides</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href={action.href}
                      className={`card p-6 hover-lift hover-glow group ${action.bgColor} border-0`}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <action.icon className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {action.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            <div className="card p-6">
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg ${
                      achievement.completed ? 'bg-green-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      achievement.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      <achievement.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className={`font-semibold text-sm ${
                        achievement.completed ? 'text-green-800' : 'text-gray-700'
                      }`}>
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        {achievement.description}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Activité récente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Activité récente</h2>
          <div className="card p-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center`}>
                      <activity.icon className={`w-5 h-5 ${activity.color}`} />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {activity.time}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-ghost p-2">
                    <EyeIcon className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Call to action premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="card-gradient p-8 text-center relative overflow-hidden"
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 transform translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400 to-orange-600 rounded-full opacity-10 transform -translate-x-12 translate-y-12"></div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center"
            >
              <SparklesIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à créer votre première lettre magique ?
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Notre IA avancée vous aide à créer des lettres de motivation personnalisées 
              qui augmentent vos chances de décrocher l'emploi de vos rêves.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/letters/new" className="btn btn-primary">
                <PlusIcon className="w-5 h-5 mr-2" />
                Créer ma première lettre
              </Link>
              <Link href="/cv" className="btn btn-secondary">
                <DocumentTextIcon className="w-5 h-5 mr-2" />
                Télécharger mon CV
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 