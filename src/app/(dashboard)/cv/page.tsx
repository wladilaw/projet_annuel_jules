'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon, 
  UserIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface CVData {
  id: string;
  fileName: string;
  fileType: string;
  content: string;
  uploadedAt: string;
}

export default function CVPage() {
  const { data: session } = useSession()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [userCvs, setUserCvs] = useState<CVData[]>([])
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    summary: '',
    experience: '',
    education: '',
    skills: ''
  })
  const [profileSaveStatus, setProfileSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [profileErrorMessage, setProfileErrorMessage] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [cvs, setCvs] = useState<CVData[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [activeTab, setActiveTab] = useState<'upload' | 'profile'>('upload')

  useEffect(() => {
    if (session?.user?.id) {
      fetchCvs()
      fetchProfileData()
    }
  }, [session])

  const fetchCvs = async () => {
    try {
      const response = await fetch('/api/cv')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des CV.')
      }
      const data: CVData[] = await response.json()
      setUserCvs(data)
      if (data.length > 0) {
        setProfileData(prev => ({ ...prev, bio: data[0].content }))
      }
      setCvs(data)
    } catch (error: any) {
      console.error('Erreur lors du chargement des CV:', error)
      setErrorMessage(error.message)
    }
  }

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile')
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération du profil.')
      }
      const data = await response.json()
      setProfileData(prev => ({ ...prev, ...data }))
    } catch (error: any) {
      console.error('Erreur lors du chargement du profil:', error)
      setProfileErrorMessage(error.message)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0])
      setUploadStatus('idle')
      setErrorMessage(null)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0])
      setUploadStatus('idle')
      setErrorMessage(null)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !session?.user?.id) {
      setErrorMessage('Veuillez sélectionner un fichier et être connecté.')
      return
    }

    setUploadStatus('uploading')
    setErrorMessage(null)

    const formData = new FormData()
    formData.append('cv', selectedFile)
    formData.append('userId', session.user.id)

    try {
      const response = await fetch('/api/cv/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors du téléversement du CV')
      }

      setUploadStatus('success')
      setSelectedFile(null)
      fetchCvs()
    } catch (error: any) {
      setUploadStatus('error')
      setErrorMessage(error.message)
    }
  }

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaveStatus('saving')
    setProfileErrorMessage(null)

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde du profil')
      }

      setProfileSaveStatus('success')
      fetchProfileData()
    } catch (error: any) {
      setProfileSaveStatus('error')
      setProfileErrorMessage(error.message)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDropFileInput = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => {
      if (file.type === 'application/pdf' || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        const newCV: CVData = {
          id: Date.now().toString(),
          fileName: file.name,
          fileType: file.type === 'application/pdf' ? 'pdf' : 'doc',
          content: '',
          uploadedAt: new Date().toISOString().split('T')[0]
        }
        setCvs(prev => [newCV, ...prev])
      }
    })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const newCV: CVData = {
        id: Date.now().toString(),
        fileName: file.name,
        fileType: file.type === 'application/pdf' ? 'pdf' : 'doc',
        content: '',
        uploadedAt: new Date().toISOString().split('T')[0]
      }
      setCvs(prev => [newCV, ...prev])
    })
  }

  const deleteCV = (id: string) => {
    setCvs(prev => prev.filter(cv => cv.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Gestion de vos CV
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Téléchargez vos CV ou créez votre profil pour générer des lettres de motivation personnalisées
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="glass rounded-2xl p-2 inline-flex">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'upload'
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CloudArrowUpIcon className="w-5 h-5 inline mr-2" />
            Télécharger CV
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserIcon className="w-5 h-5 inline mr-2" />
            Créer Profil
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'upload' ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-8"
          >
            {/* Upload Zone */}
            <div className="card p-8">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDropFileInput}
                className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50 scale-105'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <motion.div
                  animate={isDragOver ? { scale: 1.1 } : { scale: 1 }}
                  className="space-y-4"
                >
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center">
                    <CloudArrowUpIcon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Glissez-déposez vos CV ici
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Formats acceptés : PDF, DOC, DOCX (max 10MB)
                    </p>
                    <label className="btn btn-primary cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileInput}
                        className="hidden"
                      />
                      Choisir des fichiers
                    </label>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* CV List */}
            {cvs.length > 0 && (
              <div className="card p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Vos CV ({cvs.length})
                </h3>
                <div className="space-y-4">
                  {cvs.map((cv, index) => (
                    <motion.div
                      key={cv.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <DocumentTextIcon className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{cv.fileName}</h4>
                          <p className="text-sm text-gray-500">
                            {new Date(cv.uploadedAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <EyeIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-green-600 transition-colors">
                          <ArrowDownTrayIcon className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                          <PencilIcon className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => deleteCV(cv.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="card p-8"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Créer votre profil professionnel
            </h3>
            
            <form onSubmit={handleProfileSave} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <UserIcon className="w-4 h-4 inline mr-2" />
                    Prénom
                  </label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => handleProfileChange('firstName', e.target.value)}
                    className="input"
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Nom</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => handleProfileChange('lastName', e.target.value)}
                    className="input"
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <EnvelopeIcon className="w-4 h-4 inline mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="input"
                    placeholder="votre@email.com"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <PhoneIcon className="w-4 h-4 inline mr-2" />
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                    className="input"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPinIcon className="w-4 h-4 inline mr-2" />
                  Adresse
                </label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                  className="input"
                  placeholder="Votre adresse complète"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <BriefcaseIcon className="w-4 h-4 inline mr-2" />
                  Titre professionnel
                </label>
                <input
                  type="text"
                  value={profileData.title}
                  onChange={(e) => handleProfileChange('title', e.target.value)}
                  className="input"
                  placeholder="Ex: Développeur Full Stack, Chef de Projet..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Résumé professionnel</label>
                <textarea
                  value={profileData.summary}
                  onChange={(e) => handleProfileChange('summary', e.target.value)}
                  className="input min-h-[120px] resize-none"
                  placeholder="Décrivez brièvement votre profil, vos objectifs et vos atouts..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <BriefcaseIcon className="w-4 h-4 inline mr-2" />
                  Expérience professionnelle
                </label>
                <textarea
                  value={profileData.experience}
                  onChange={(e) => handleProfileChange('experience', e.target.value)}
                  className="input min-h-[150px] resize-none"
                  placeholder="Listez vos expériences principales avec les postes, entreprises, dates et missions..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <AcademicCapIcon className="w-4 h-4 inline mr-2" />
                  Formation
                </label>
                <textarea
                  value={profileData.education}
                  onChange={(e) => handleProfileChange('education', e.target.value)}
                  className="input min-h-[120px] resize-none"
                  placeholder="Vos diplômes, formations et certifications..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <StarIcon className="w-4 h-4 inline mr-2" />
                  Compétences clés
                </label>
                <textarea
                  value={profileData.skills}
                  onChange={(e) => handleProfileChange('skills', e.target.value)}
                  className="input min-h-[100px] resize-none"
                  placeholder="Listez vos compétences techniques et soft skills..."
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button type="button" className="btn btn-secondary">
                  Aperçu
                </button>
                <button type="submit" className="btn btn-primary">
                  Sauvegarder le profil
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 