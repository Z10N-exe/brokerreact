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
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Trade Smart with
              <span className="block text-yellow-300">Aspire Secure Trade</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Join thousands of successful traders earning consistent profits with our advanced forex trading platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn-primary bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 text-lg">
                Start Trading Now
              </Link>
              <Link to="/login" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-8 text-lg">
                Login to Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Aspire Secure Trade?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide everything you need to succeed in forex trading
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">$50M+</div>
              <div className="text-gray-600">Total Volume Traded</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Traders</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">15%</div>
              <div className="text-gray-600">Average Monthly Return</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Traders Say
            </h2>
            <p className="text-xl text-gray-600">
              Real testimonials from successful traders
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-500 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Trading Journey?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of successful traders and start earning consistent profits today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="btn-primary bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 text-lg">
              Create Free Account
            </Link>
            <Link to="/login" className="btn-secondary bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-600 py-3 px-8 text-lg">
              Login to Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
