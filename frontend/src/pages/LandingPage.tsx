import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, MessageCircle, Calendar, TrendingUp, Heart,
  ArrowRight, CheckCircle, Quote, ChevronLeft, ChevronRight, Building2,
  Hammer, HardHat, Ruler, Trophy, Target, Lightbulb, GraduationCap,
  MapPin, Globe, Award
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Footer from '../components/common/Footer';

// Import images
import bitLogo from '../assets/logos/logo.png';
import chaurahaConstr from '../assets/civil eng element/chauraha constrt.jpeg';
import bigBuildingGreenish from '../assets/civil eng element/big building greenish.png';
import studentDiscuss from '../assets/civil eng element/student discuss.png';
import alumniTalk from '../assets/civil eng element/studnet alumni talk.png';
import aestheticBuilding from '../assets/civil eng element/aesthetic building.jpeg';
import bimProject from '../assets/civil eng element/BIM Project Management Software _ BEXEL Manager.jpeg';
import bridgesWithNames from '../assets/civil eng element/bridges with names.jpeg';
import beautifulBuilding from '../assets/civil eng element/buitiful building.jpeg';
import roadDesign from '../assets/civil eng element/Road Design_ Pavement Thickness and Material Quantity Calculations.jpeg';
import multiFamousBuilding from '../assets/civil eng element/multi famous building.jpeg';
import nightView from '../assets/civil eng element/night view 🤍🪟.jpeg';
import trendyCivil from '../assets/civil eng element/trendy civil.jpeg';
import architecture3d from '../assets/civil eng element/3d architecture design.jpeg';
import bim10Dimensions from '../assets/civil eng element/BIM 10 Dimensions.jpeg';
import buildingOpenness from '../assets/civil eng element/buildingopenness.jpeg';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  // Hero section images for carousel
  const heroImages = [
    { src: chaurahaConstr, title: 'Infrastructure Construction' },
    { src: bigBuildingGreenish, title: 'Green Infrastructure' },
    { src: aestheticBuilding, title: 'Aesthetic Design' },
    { src: beautifulBuilding, title: 'Beautiful Structures' },
    { src: nightView, title: 'Night Views' },
  ];

  const stats = {
    alumni: 1250,
    students: 850,
    companies: 350,
    opportunities: 120,
    events: 45,
    projects: 200,
  };

  const testimonials = [
    {
      id: 1,
      name: "Er. Rahul Sharma",
      batch: "2015",
      role: "Senior Structural Engineer at L&T Construction",
      company: "Larsen & Toubro",
      quote: "Alumni Connect bridges the gap between experience and ambition. I've mentored 5 civil engineering students and helped 3 of them secure positions in top infrastructure companies. The platform's focus on our domain makes networking more meaningful."
    },
    {
      id: 2,
      name: "Priya Singh",
      batch: "2020",
      role: "Project Engineer at Tata Projects",
      company: "Tata Projects",
      quote: "Thanks to Alumni Connect, I found my first job in highway construction! Senior alumni shared their interview experiences and technical knowledge that was crucial for my selection. The civil engineering-specific resources are invaluable."
    },
    {
      id: 3,
      name: "Er. Amit Kumar",
      batch: "2010",
      role: "Project Manager at AECOM",
      company: "AECOM",
      quote: "This platform reconnected me with my BIT Sindri civil engineering batchmates. We now collaborate on projects and share industry insights. It's amazing to see our ACE community making an impact on India's infrastructure!"
    }
  ];

  // Auto-slide testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Auto-slide hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change image every 4 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-sky-50 to-blue-50 border-b border-sky-200 shadow-sm backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src={bitLogo}
                alt="BIT Sindri Logo"
                className="h-14 w-14 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Alumni Connect</h1>
                <p className="text-xs text-orange-600 font-semibold">ACE BIT Sindri</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a href="#features" className="text-gray-600 hover:text-orange-600 transition-colors">Features</a>
              <a href="#about" className="text-gray-600 hover:text-orange-600 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-600 hover:text-orange-600 transition-colors">Success Stories</a>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/login')} className="hidden sm:inline-flex">
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/signup')}
                className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Civil Engineering Theme */}
      <section className="relative bg-gradient-to-br from-sky-50 via-green-50 to-blue-50 text-gray-900 py-16 md:py-24 overflow-hidden min-h-[600px]">
        {/* Sliding Background Images Carousel with Cool Effects */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                index === currentHeroImage
                  ? 'opacity-100 scale-100 blur-0'
                  : index === (currentHeroImage - 1 + heroImages.length) % heroImages.length
                  ? 'opacity-0 -translate-x-full scale-95 blur-sm'
                  : 'opacity-0 translate-x-full scale-95 blur-sm'
              }`}
            >
              <img
                src={image.src}
                alt={image.title}
                className="w-full h-full object-cover object-center"
                style={{ filter: 'brightness(0.9)' }}
              />
              {/* Fully transparent overlay - no color overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/5"></div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`h-2.5 rounded-full transition-all duration-300 shadow-lg ${
                index === currentHeroImage
                  ? 'bg-orange-600 w-10'
                  : 'bg-white/60 w-2.5 hover:bg-orange-400'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center min-h-[500px] flex flex-col justify-center">
            {/* Text Content - Centered with Better Visibility */}
            <Badge variant="success" className="mb-6 bg-white/95 text-orange-600 backdrop-blur-sm border-2 border-orange-200 shadow-lg inline-flex mx-auto">
              <Building2 size={16} className="mr-2" />
              ACE BIT Sindri
            </Badge>

            <div className="mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">Connect.</span>{' '}
                <span className="text-orange-500 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">Grow.</span>{' '}
                <span className="text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">Succeed.</span>
              </h1>

              <p className="text-xl md:text-2xl text-white leading-relaxed max-w-3xl mx-auto font-bold drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] [text-shadow:_2px_2px_4px_rgb(0_0_0_/_80%)]">
                Join <span className="font-bold text-orange-400 text-2xl md:text-3xl">1,250+</span> civil engineering professionals from BIT Sindri
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/signup/student')}
                className="bg-gradient-to-r from-orange-600 to-orange-700 text-white hover:from-orange-700 hover:to-orange-800 font-semibold shadow-xl"
              >
                <GraduationCap size={20} className="mr-2" />
                Join as Student
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/signup/alumni')}
                className="border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold bg-white/90 backdrop-blur-sm"
              >
                <HardHat size={20} className="mr-2" />
                Join as Alumni
              </Button>
            </div>

            {/* Quick Stats - More Visible */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              {[
                { value: '1,250+', label: 'Alumni' },
                { value: '350+', label: 'Companies' },
                { value: '120+', label: 'Opportunities' },
              ].map((stat, index) => (
                <div key={index} className="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-gray-200">
                  <p className="text-4xl font-bold text-orange-600 mb-1">{stat.value}</p>
                  <p className="text-sm font-semibold text-gray-700">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave Separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* About ACE Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge variant="primary" className="mb-4">
                <Building2 size={16} className="mr-2" />
                About ACE BIT Sindri
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Association of Civil Engineers
              </h2>
              <p className="text-xl text-gray-600">
                Connecting civil engineering professionals since 1957
              </p>
            </div>

            {/* Image Showcase */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer" onClick={() => window.open(bridgesWithNames, '_blank')}>
                <img
                  src={bridgesWithNames}
                  alt="Famous Bridges"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">Infrastructure Projects</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer" onClick={() => window.open(multiFamousBuilding, '_blank')}>
                <img
                  src={multiFamousBuilding}
                  alt="Famous Buildings"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">Architectural Marvels</p>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer" onClick={() => window.open(architecture3d, '_blank')}>
                <img
                  src={architecture3d}
                  alt="3D Architecture"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                  <p className="text-white font-semibold">Modern Design</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card variant="elevated" className="p-6 bg-white">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Trophy className="text-orange-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Legacy</h3>
                <p className="text-gray-600 leading-relaxed">
                  The Department of Civil Engineering was started in 1957. The department has produced
                  over 1,250+ civil engineers who are now contributing to India's infrastructure
                  development across highways, bridges, dams, structural engineering, and soil mechanics projects.
                  We specialize in Soil Mechanics & Foundation Engineering, and Structural Engineering.
                </p>
              </Card>

              <Card variant="elevated" className="p-6 bg-white">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Target className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed">
                  To create a vibrant community where civil engineering students and alumni
                  collaborate, share knowledge, and build the infrastructure that powers India's
                  growth. The department provides adequate facilities for R&D work and thus provides
                  a vital impetus in the growth of the state.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">
              <Lightbulb size={16} className="mr-2" />
              Platform Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything Civil Engineers Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Specialized tools and features designed specifically for civil engineering professionals
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="text-orange-600" size={32} />,
                title: 'Alumni Network',
                description: 'Connect with 1,250+ civil engineering alumni working in top infrastructure companies across India and abroad.',
                color: 'orange'
              },
              {
                icon: <Briefcase className="text-blue-600" size={32} />,
                title: 'Job & Internship Board',
                description: 'Access exclusive opportunities in construction, structural design, project management, and infrastructure development.',
                color: 'blue'
              },
              {
                icon: <GraduationCap className="text-green-600" size={32} />,
                title: 'Mentorship Program',
                description: 'Get guidance from experienced civil engineers on career paths, technical skills, and industry certifications.',
                color: 'green'
              },
              {
                icon: <Hammer className="text-purple-600" size={32} />,
                title: 'Project Showcase',
                description: 'Share your construction projects, design work, and technical innovations with the community.',
                color: 'purple'
              },
              {
                icon: <Calendar className="text-indigo-600" size={32} />,
                title: 'Technical Workshops',
                description: 'Attend workshops on AutoCAD, STAAD Pro, BIM, project management, and latest construction technologies.',
                color: 'indigo'
              },
              {
                icon: <MessageCircle className="text-pink-600" size={32} />,
                title: 'Knowledge Exchange',
                description: 'Discuss structural designs, construction techniques, material specifications, and solve technical challenges together.',
                color: 'pink'
              },
            ].map((feature, index) => (
              <Card
                key={index}
                variant="elevated"
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-t-4 border-t-current"
                style={{ borderTopColor: `var(--color-${feature.color}-600)` }}
              >
                <div className={`w-16 h-16 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-sky-500 via-blue-500 to-cyan-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-xl text-sky-100">
              Building India's infrastructure, one connection at a time
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {[
              { label: 'Alumni Engineers', value: stats.alumni, icon: <HardHat /> },
              { label: 'Current Students', value: stats.students, icon: <GraduationCap /> },
              { label: 'Partner Companies', value: stats.companies, icon: <Building2 /> },
              { label: 'Job Opportunities', value: stats.opportunities, icon: <Briefcase /> },
              { label: 'Technical Events', value: stats.events, icon: <Calendar /> },
              { label: 'Projects Shared', value: stats.projects, icon: <Hammer /> },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  {React.cloneElement(stat.icon, { size: 28, className: 'text-yellow-300' })}
                </div>
                <p className="text-4xl font-bold mb-2">{stat.value.toLocaleString()}+</p>
                <p className="text-sky-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">
              <Target size={16} className="mr-2" />
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Started in 3 Simple Steps
            </h2>
          </div>

          {/* Visual Process Flow with Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <img
                src={studentDiscuss}
                alt="Students Discussing"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => window.open(studentDiscuss, '_blank')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-900/80 via-orange-900/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">Connect with Alumni</h3>
                <p className="text-orange-100">Build meaningful connections with civil engineering professionals</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
              <img
                src={alumniTalk}
                alt="Alumni Student Interaction"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-110"
                onClick={() => window.open(alumniTalk, '_blank')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/40 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-white text-2xl font-bold mb-2">Learn & Grow</h3>
                <p className="text-blue-100">Gain insights from experienced professionals in the industry</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                description: 'Sign up with your BIT Sindri credentials. Add your civil engineering specialization, projects, and career interests.',
                icon: <GraduationCap size={32} />
              },
              {
                step: '02',
                title: 'Connect & Network',
                description: 'Find alumni from your batch or working in your field of interest. Join domain-specific groups and discussions.',
                icon: <Users size={32} />
              },
              {
                step: '03',
                title: 'Grow Your Career',
                description: 'Access job opportunities, attend technical workshops, get mentorship, and contribute to the community.',
                icon: <TrendingUp size={32} />
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <Card variant="elevated" className="p-8 text-center hover:shadow-xl transition-all">
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="mt-8 mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                      {React.cloneElement(step.icon, { className: 'text-orange-600' })}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </Card>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-1/2 -translate-y-1/2">
                    <ArrowRight size={24} className="text-orange-600" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Civil Engineering Technologies Showcase */}
      <section className="py-20 bg-gradient-to-br from-white via-sky-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge variant="primary" className="mb-4">
              <Lightbulb size={16} className="mr-2" />
              Modern Technologies
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Civil Engineering Technologies
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest tools and methodologies in civil engineering
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card variant="elevated" className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <img
                src={bimProject}
                alt="BIM Project Management"
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(bimProject, '_blank')}
              />
              <div className="p-6">
                <Badge variant="primary" className="mb-3">
                  <Building2 size={14} className="mr-1" />
                  BIM Technology
                </Badge>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Building Information Modeling
                </h3>
                <p className="text-gray-600">
                  Advanced BIM tools for project planning, visualization, and management in modern construction projects.
                </p>
              </div>
            </Card>

            <Card variant="elevated" className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <img
                src={bim10Dimensions}
                alt="BIM Dimensions"
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(bim10Dimensions, '_blank')}
              />
              <div className="p-6">
                <Badge variant="success" className="mb-3">
                  <Ruler size={14} className="mr-1" />
                  10D BIM
                </Badge>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Multi-Dimensional Design
                </h3>
                <p className="text-gray-600">
                  Explore the 10 dimensions of BIM technology for comprehensive project lifecycle management.
                </p>
              </div>
            </Card>

            <Card variant="elevated" className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <img
                src={roadDesign}
                alt="Road Design & Pavement"
                className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(roadDesign, '_blank')}
              />
              <div className="p-6">
                <Badge variant="warning" className="mb-3 bg-yellow-100 text-yellow-800">
                  <Hammer size={14} className="mr-1" />
                  Infrastructure
                </Badge>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Road & Pavement Design
                </h3>
                <p className="text-gray-600">
                  Advanced calculations for pavement thickness, material quantities, and highway engineering.
                </p>
              </div>
            </Card>
          </div>

          {/* Additional Images Showcase */}
          <div className="grid md:grid-cols-4 gap-4 mt-12 max-w-6xl mx-auto">
            <div className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => window.open(aestheticBuilding, '_blank')}>
              <img
                src={aestheticBuilding}
                alt="Aesthetic Building"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Aesthetic Design</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => window.open(beautifulBuilding, '_blank')}>
              <img
                src={beautifulBuilding}
                alt="Beautiful Building"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Modern Architecture</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => window.open(nightView, '_blank')}>
              <img
                src={nightView}
                alt="Night View Building"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Night Aesthetics</p>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg shadow-md group cursor-pointer" onClick={() => window.open(trendyCivil, '_blank')}>
              <img
                src={trendyCivil}
                alt="Trendy Civil Engineering"
                className="w-full h-40 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white font-semibold">Innovative Design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">
              <Heart size={16} className="mr-2" />
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Real experiences from civil engineering professionals
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card variant="elevated" className="p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-4 left-4 text-orange-200">
                <Quote size={80} />
              </div>

              <div className="relative z-10">
                <div className="mb-8">
                  <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-6 italic">
                    "{testimonials[currentTestimonial].quote}"
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-800 rounded-full flex items-center justify-center">
                      <HardHat className="text-white" size={28} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        {testimonials[currentTestimonial].name}
                      </p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].role}</p>
                      <p className="text-sm text-orange-600 font-medium">
                        Batch of {testimonials[currentTestimonial].batch} • {testimonials[currentTestimonial].company}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={prevTestimonial}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentTestimonial ? 'bg-orange-600 w-8' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-600 via-blue-600 to-cyan-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Building2 size={400} className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4" />
          <Hammer size={300} className="absolute bottom-0 left-0 -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Build Your Future?
            </h2>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Join the largest civil engineering alumni network from BIT Sindri.
              Connect, learn, and grow with fellow engineers.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                variant="primary"
                onClick={() => navigate('/signup')}
                className="bg-white text-sky-700 hover:bg-gray-100 font-semibold shadow-xl"
              >
                <GraduationCap size={20} className="mr-2" />
                Join Now - It's Free
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="border-2 border-white text-white hover:bg-white hover:text-sky-700 font-semibold"
              >
                Already a Member? Login
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Verified Alumni</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle size={20} className="text-green-400" />
                <span>Active Community</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
