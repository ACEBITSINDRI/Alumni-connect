import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Briefcase, MessageCircle, Calendar, TrendingUp, Heart,
  ArrowRight, CheckCircle, Quote, ChevronLeft, ChevronRight
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Footer from '../components/common/Footer';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Mock data - replace with API calls
  const stats = {
    alumni: 1250,
    students: 850,
    companies: 350,
    opportunities: 120,
    events: 45,
  };

  const testimonials = [
    {
      id: 1,
      name: "Rahul Sharma",
      batch: "2015",
      role: "Senior Engineer at Larsen & Toubro",
      image: "/testimonials/rahul.jpg",
      quote: "Alumni Connect helped me give back to my college community. I've mentored 5 students and helped 3 of them land their first jobs!"
    },
    {
      id: 2,
      name: "Priya Singh",
      batch: "2020",
      role: "Final Year Student",
      image: "/testimonials/priya.jpg",
      quote: "Thanks to Alumni Connect, I got my dream internship! The seniors were so helpful and guided me throughout the application process."
    },
    {
      id: 3,
      name: "Amit Kumar",
      batch: "2010",
      role: "Project Manager at AECOM",
      image: "/testimonials/amit.jpg",
      quote: "This platform reconnected me with my batchmates and juniors. It's amazing to see how our ACE community has grown!"
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar for Landing Page */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">AC</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Alumni Connect</h1>
                <p className="text-xs text-gray-500">by ACE BIT Sindri</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="primary" onClick={() => navigate('/signup')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="info" className="mb-6 bg-white/20 text-white backdrop-blur-sm">
              An Initiative of ACE BIT Sindri
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Connecting BIT Sindri Civil Engineers
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Join the ACE community to connect with alumni and students, explore opportunities, and grow together
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-700 hover:bg-gray-100"
                onClick={() => navigate('/signup/student')}
              >
                Student Login
                <ArrowRight size={20} className="ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                onClick={() => navigate('/signup/alumni')}
              >
                Alumni Login
                <ArrowRight size={20} className="ml-2" />
              </Button>
            </div>
            <button
              onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-8 text-sm text-gray-200 hover:text-white transition-colors"
            >
              Learn More ↓
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              About Alumni Connect
            </h2>
            <p className="text-lg text-gray-600">
              Alumni Connect is a dedicated platform created by ACE (Association of Civil Engineers),
              BIT Sindri to bridge the gap between current students and alumni of the Civil Engineering department.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Card variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Students</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Connect with successful alumni for guidance and mentorship</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Access exclusive job and internship opportunities</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Learn from industry professionals and their experiences</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Participate in workshops, seminars, and networking events</span>
                </li>
              </ul>
            </Card>
            <Card variant="elevated" className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">For Alumni</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Give back to your alma mater by mentoring students</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Post job opportunities and help students kickstart their careers</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Reconnect with batchmates and expand your professional network</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Contribute to ACE initiatives and college development</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to connect, collaborate, and grow in one place
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Users size={32} />}
              title="Connect with Alumni"
              description="Search and connect with thousands of alumni from different batches, companies, and domains"
              color="blue"
            />
            <FeatureCard
              icon={<Briefcase size={32} />}
              title="Job & Internship Opportunities"
              description="Get direct access to job postings and internship opportunities from alumni working in top companies"
              color="green"
            />
            <FeatureCard
              icon={<MessageCircle size={32} />}
              title="Mentorship Programs"
              description="Learn from experienced professionals who are eager to guide and mentor the next generation"
              color="purple"
            />
            <FeatureCard
              icon={<Calendar size={32} />}
              title="Community Events"
              description="Attend workshops, seminars, webinars, and networking events organized by ACE"
              color="orange"
            />
            <FeatureCard
              icon={<TrendingUp size={32} />}
              title="Professional Networking"
              description="Build meaningful professional connections that can help advance your career"
              color="indigo"
            />
            <FeatureCard
              icon={<Heart size={32} />}
              title="Give Back to ACE"
              description="Alumni can contribute to ACE initiatives and help in the development of the department"
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 md:py-24 bg-primary-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our Growing Community
            </h2>
            <p className="text-lg text-gray-100">
              Join thousands of students and alumni already connected through our platform
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 max-w-5xl mx-auto">
            <StatCard number={stats.alumni} label="Registered Alumni" />
            <StatCard number={stats.students} label="Active Students" />
            <StatCard number={stats.companies} label="Companies Represented" />
            <StatCard number={stats.opportunities} label="Job Opportunities" />
            <StatCard number={stats.events} label="Events Conducted" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in three simple steps
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <StepCard
              number={1}
              title="Sign Up"
              description="Create your profile as a student or alumni with your BIT Sindri credentials"
            />
            <StepCard
              number={2}
              title="Connect"
              description="Find and connect with alumni or students based on interests, companies, or batch"
            />
            <StepCard
              number={3}
              title="Grow"
              description="Share opportunities, learn from experiences, and contribute to the community"
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600">
              Hear from our community members
            </p>
          </div>
          <div className="max-w-4xl mx-auto relative">
            <Card variant="elevated" className="p-8 md:p-12">
              <Quote size={48} className="text-primary-200 mb-6" />
              <p className="text-lg md:text-xl text-gray-700 mb-6 italic">
                "{testimonials[currentTestimonial].quote}"
              </p>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <Users size={32} className="text-primary-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                  <p className="text-sm text-gray-600">{testimonials[currentTestimonial].role}</p>
                  <p className="text-xs text-gray-500">Batch of {testimonials[currentTestimonial].batch}</p>
                </div>
              </div>
            </Card>

            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={24} className="text-gray-700" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={24} className="text-gray-700" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentTestimonial ? 'bg-primary-600 w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Join the ACE Community?
          </h2>
          <p className="text-xl mb-8 text-gray-100 max-w-2xl mx-auto">
            Connect with {stats.alumni}+ alumni and start building meaningful relationships today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary-700 hover:bg-gray-100"
              onClick={() => navigate('/signup')}
            >
              Sign Up Now
              <ArrowRight size={20} className="ml-2" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Feature Card Component
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, color }) => {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-green-600 bg-green-50',
    purple: 'text-purple-600 bg-purple-50',
    orange: 'text-orange-600 bg-orange-50',
    indigo: 'text-indigo-600 bg-indigo-50',
    red: 'text-red-600 bg-red-50',
  };

  return (
    <Card variant="elevated" className="p-6 hover:shadow-xl transition-shadow">
      <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

// Stat Card Component
interface StatCardProps {
  number: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        setCount(number);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="text-center">
      <p className="text-4xl md:text-5xl font-bold mb-2">{count}+</p>
      <p className="text-gray-100">{label}</p>
    </div>
  );
};

// Step Card Component
interface StepCardProps {
  number: number;
  title: string;
  description: string;
}

const StepCard: React.FC<StepCardProps> = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default LandingPage;
