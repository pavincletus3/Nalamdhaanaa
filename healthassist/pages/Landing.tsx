import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Heart,
  Shield,
  Users,
  Zap,
  ArrowRight,
  Github,
  Linkedin,
} from "lucide-react";

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleSignIn = () => {
    navigate("/login");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead Developer & Medical Advisor",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Alex Rodriguez",
      role: "Full Stack Developer",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      github: "#",
    },
    {
      name: "Maya Patel",
      role: "UI/UX Designer",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      github: "#",
    },
    {
      name: "James Wilson",
      role: "Backend Engineer",
      image: "/api/placeholder/150/150",
      linkedin: "#",
      github: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-xl border-b border-gray-200/50 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">
                Nalamdhaanaa
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button onClick={handleDashboard} className="btn-secondary">
                    Dashboard
                  </button>
                  <button onClick={logout} className="btn-secondary">
                    Sign Out
                  </button>
                </>
              ) : (
                <button onClick={handleSignIn} className="btn-primary">
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/5 to-emerald-600/5"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-5xl mx-auto">
            <div className="animate-float mb-8">
              <div className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 shadow-lg">
                <span className="text-sm font-semibold text-primary-700">
                  🚀 Revolutionizing Healthcare Management
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8">
              Your Personal
              <span className="text-gradient block">Health Companion</span>
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
              Manage prescriptions, track medications, find nearby healthcare,
              and get AI-powered health insights—all in one beautifully designed
              platform built for the modern world.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              {user ? (
                <button
                  onClick={handleDashboard}
                  className="btn-primary text-lg px-10 py-5 flex items-center justify-center space-x-3 group"
                >
                  <span>View Dashboard</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  className="btn-primary text-lg px-10 py-5 flex items-center justify-center space-x-3 group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
                </button>
              )}
              <button className="btn-secondary text-lg px-10 py-5">
                Watch Demo
              </button>
            </div>
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900">10K+</div>
                <div className="text-sm text-gray-600">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">50K+</div>
                <div className="text-sm text-gray-600">
                  Prescriptions Managed
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900">24/7</div>
                <div className="text-sm text-gray-600">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for better health management
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We've built a comprehensive platform that puts your health data at
              your fingertips, making healthcare management simple and
              intuitive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-interactive p-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Smart Prescriptions
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track your medications, set intelligent reminders, and never
                miss a dose with our AI-powered prescription management system.
              </p>
            </div>

            <div className="card-interactive p-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                AI Health Assistant
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant, personalized health insights with our advanced AI
                chatbot trained on comprehensive medical knowledge and symptom
                analysis.
              </p>
            </div>

            <div className="card-interactive p-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Nearby Healthcare
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Discover hospitals, clinics, and pharmacies near you with
                real-time availability, ratings, and turn-by-turn directions.
              </p>
            </div>

            <div className="card-interactive p-8 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Smart Health Alerts
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Stay ahead with personalized health alerts, medication
                reminders, and proactive appointment notifications tailored to
                your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">
              Revolutionizing Healthcare Management
            </h2>
            <div className="text-lg text-gray-600 space-y-6 leading-relaxed">
              <p>
                Nalamdhaanaa is more than just a health app—it's your personal
                healthcare ecosystem. We're building a platform that bridges the
                gap between patients and healthcare providers, making medical
                information accessible, understandable, and actionable.
              </p>
              <p>
                Our mission is to empower individuals to take control of their
                health journey through technology. By combining AI-powered
                insights, comprehensive medication management, and
                location-based healthcare services, we're creating a future
                where healthcare is proactive, not reactive.
              </p>
              <p>
                From tracking your daily medications to finding the nearest
                emergency care, Nalamdhaanaa is designed to be your trusted
                companion in every aspect of your health and wellness journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A passionate group of healthcare professionals, developers, and
              designers working together to transform healthcare technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="card-interactive p-8 text-center group team-card fade-in-up"
              >
                <div className="w-28 h-28 bg-gradient-to-br from-primary-100 to-emerald-100 rounded-3xl mx-auto mb-6 overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold group-hover:scale-110 transition-transform duration-300">
                    {member.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-gray-600 mb-6 font-medium">{member.role}</p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.linkedin}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-200"
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                  <a
                    href={member.github}
                    className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <Github className="h-5 w-5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <div className="p-2 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl shadow-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Nalamdhaanaa
              </span>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-300 text-lg font-medium">
                © 2024 Nalamdhaanaa. Built with ❤️ for better health management.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Empowering healthier lives through innovative technology.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
