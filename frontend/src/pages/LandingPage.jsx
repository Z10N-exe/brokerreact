import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, DollarSign, CheckCircle, Star } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      title: "High Returns",
      description: "Earn up to 15% monthly returns on your investments with our proven trading strategies."
    },
    {
      icon: <Shield className="h-8 w-8 text-primary-600" />,
      title: "Secure Trading",
      description: "Your funds are protected with bank-level security and insurance coverage."
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: "Expert Team",
      description: "Our professional traders have years of experience in forex markets."
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary-600" />,
      title: "Easy Withdrawals",
      description: "Quick and hassle-free withdrawal process with 24/7 support."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      comment: "Aspire Secure Trade has been a game-changer for my investment portfolio. The returns are consistent and the platform is very user-friendly."
    },
    {
      name: "Michael Chen",
      location: "London, UK",
      rating: 5,
      comment: "I've been trading with them for over a year now. The support team is excellent and the profits are real. Highly recommended!"
    },
    {
      name: "Emma Davis",
      location: "Sydney, Australia",
      rating: 5,
      comment: "The best forex trading platform I've used. Transparent, secure, and profitable. My investment has grown significantly."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="gradient-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up">
              Trade Smart with
              <span className="block bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Aspire Secure Trade</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-3xl mx-auto">
              Join thousands of successful traders earning consistent profits with our advanced forex trading platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary text-lg mobile-button">
                Start Trading Now
              </Link>
              <Link to="/login" className="btn-secondary text-lg mobile-button">
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Choose Aspire Secure Trade?
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              We provide everything you need to succeed in forex trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card-dark card-hover p-6 text-center mobile-card">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-blue-600/20 rounded-lg">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="card-dark p-6 mobile-card">
              <div className="text-4xl font-bold text-blue-400 mb-2">$50M+</div>
              <div className="text-slate-300">Total Volume Traded</div>
            </div>
            <div className="card-dark p-6 mobile-card">
              <div className="text-4xl font-bold text-blue-400 mb-2">10,000+</div>
              <div className="text-slate-300">Active Traders</div>
            </div>
            <div className="card-dark p-6 mobile-card">
              <div className="text-4xl font-bold text-blue-400 mb-2">15%</div>
              <div className="text-slate-300">Average Monthly Return</div>
            </div>
            <div className="card-dark p-6 mobile-card">
              <div className="text-4xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-slate-300">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Our Traders Say
            </h2>
            <p className="text-xl text-slate-300">
              Real testimonials from successful traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card-dark card-hover p-6 mobile-card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-slate-400 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-accent text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Join thousands of successful traders and start earning consistent profits today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary text-lg mobile-button">
              Create Free Account
            </Link>
            <Link to="/login" className="btn-secondary text-lg mobile-button">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
