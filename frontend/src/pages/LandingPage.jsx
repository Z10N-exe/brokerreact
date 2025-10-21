import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, DollarSign, CheckCircle, Star, ArrowRight, Zap, Globe, Award, Clock, Lock, Phone, Mail, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    volume: 0,
    traders: 0,
    returns: 0,
    support: 0
  });

  useEffect(() => {
    setIsVisible(true);
    
    // Animate counters
    const targetValues = { volume: 50, traders: 10000, returns: 15, support: 24 };
    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      
      setCounters({
        volume: Math.floor(targetValues.volume * progress),
        traders: Math.floor(targetValues.traders * progress),
        returns: Math.floor(targetValues.returns * progress),
        support: Math.floor(targetValues.support * progress)
      });
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setCounters(targetValues);
      }
    }, stepDuration);
    
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <TrendingUp className="h-10 w-10 text-blue-400" />,
      title: "High Returns",
      description: "Earn up to 15% monthly returns with our proven algorithmic trading strategies.",
      highlight: "15% Monthly"
    },
    {
      icon: <Shield className="h-10 w-10 text-green-400" />,
      title: "Bank-Level Security",
      description: "Your funds are protected with military-grade encryption and insurance coverage.",
      highlight: "100% Secure"
    },
    {
      icon: <Users className="h-10 w-10 text-purple-400" />,
      title: "Expert Team",
      description: "Professional traders with 10+ years experience managing millions in assets.",
      highlight: "10+ Years"
    },
    {
      icon: <DollarSign className="h-10 w-10 text-yellow-400" />,
      title: "Instant Withdrawals",
      description: "Get your profits in minutes with our lightning-fast withdrawal system.",
      highlight: "24/7 Access"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      rating: 5,
      comment: "Aspire Secure Trade has been a game-changer for my investment portfolio. The returns are consistent and the platform is very user-friendly.",
      avatar: "SJ",
      profit: "+$12,450"
    },
    {
      name: "Michael Chen",
      location: "London, UK",
      rating: 5,
      comment: "I've been trading with them for over a year now. The support team is excellent and the profits are real. Highly recommended!",
      avatar: "MC",
      profit: "+$8,920"
    },
    {
      name: "Emma Davis",
      location: "Sydney, Australia",
      rating: 5,
      comment: "The best forex trading platform I've used. Transparent, secure, and profitable. My investment has grown significantly.",
      avatar: "ED",
      profit: "+$15,680"
    }
  ];

  const plans = [
    {
      name: "Starter",
      price: "$100",
      minDeposit: "$100",
      returns: "8%",
      features: ["Basic trading signals", "Email support", "Mobile app access", "Daily reports"],
      popular: false
    },
    {
      name: "Professional",
      price: "$500",
      minDeposit: "$500",
      returns: "12%",
      features: ["Advanced trading signals", "24/7 phone support", "Priority withdrawal", "Weekly consultations", "Risk management tools"],
      popular: true
    },
    {
      name: "Premium",
      price: "$1,000",
      minDeposit: "$1,000",
      returns: "15%",
      features: ["VIP trading signals", "Dedicated account manager", "Instant withdrawal", "Daily consultations", "Advanced analytics", "Exclusive events"],
      popular: false
    }
  ];

  const faqs = [
    {
      question: "How much can I earn with Aspire Secure Trade?",
      answer: "Our traders typically earn 8-15% monthly returns, depending on the plan chosen. Past performance is not indicative of future results, but our track record speaks for itself."
    },
    {
      question: "Is my money safe and secure?",
      answer: "Absolutely. We use bank-level encryption, maintain segregated accounts, and are fully insured. Your funds are never mixed with our operational capital."
    },
    {
      question: "How quickly can I withdraw my profits?",
      answer: "Withdrawals are processed within 24 hours for standard accounts and instantly for Premium members. We support multiple withdrawal methods including bank transfers and crypto."
    },
    {
      question: "Do I need trading experience?",
      answer: "No experience required! Our expert team handles all trading activities. You simply deposit funds and watch your account grow with professional management."
    },
    {
      question: "What is the minimum deposit?",
      answer: "You can start with as little as $100. We offer flexible plans to suit different investment levels and goals."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%)`
          }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-blue-300 text-sm font-medium">Trusted by 10,000+ Traders Worldwide</span>
            </div>
            
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              Turn $100 Into
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                $1,000+
              </span>
              <span className="block text-3xl md:text-5xl text-slate-300 mt-2">
                With Expert Trading
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Join thousands of successful traders earning <span className="text-green-400 font-semibold">8-15% monthly returns</span> with our AI-powered forex trading system. 
              <span className="block mt-2 text-lg">No experience required - our experts handle everything for you.</span>
            </p>
            
            {/* Key Benefits */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              <div className="flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-green-300">Guaranteed Returns</span>
              </div>
              <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
                <Lock className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-blue-300">Bank-Level Security</span>
              </div>
              <div className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
                <Clock className="h-5 w-5 text-purple-400 mr-2" />
                <span className="text-purple-300">24/7 Support</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105">
                <span className="flex items-center justify-center">
                  Start Earning Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <Link to="/login" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300">
                View Dashboard
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-400">
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 text-blue-400 mr-1" />
                <span className="text-sm">10,000+ Active Traders</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-green-400 mr-1" />
                <span className="text-sm">50+ Countries</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 bg-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Traders Choose
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Aspire Secure Trade</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              We've helped thousands of traders achieve financial freedom through our proven trading system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <div className="flex justify-center mb-6">
                    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="inline-block bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 mb-3">
                      <span className="text-green-400 text-sm font-semibold">{feature.highlight}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Animation */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Traders Worldwide
            </h2>
            <p className="text-xl text-slate-300">
              Our numbers speak for themselves
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
                <div className="text-5xl font-bold text-blue-400 mb-2">
                  ${counters.volume}M+
                </div>
                <div className="text-slate-300 font-medium">Total Volume Traded</div>
                <div className="text-slate-500 text-sm mt-2">Across all markets</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300">
                <div className="text-5xl font-bold text-green-400 mb-2">
                  {counters.traders.toLocaleString()}+
                </div>
                <div className="text-slate-300 font-medium">Active Traders</div>
                <div className="text-slate-500 text-sm mt-2">Growing daily</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
                <div className="text-5xl font-bold text-purple-400 mb-2">
                  {counters.returns}%
                </div>
                <div className="text-slate-300 font-medium">Average Monthly Return</div>
                <div className="text-slate-500 text-sm mt-2">Consistent profits</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-yellow-500/50 transition-all duration-300">
                <div className="text-5xl font-bold text-yellow-400 mb-2">
                  {counters.support}/7
                </div>
                <div className="text-slate-300 font-medium">Customer Support</div>
                <div className="text-slate-500 text-sm mt-2">Always available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Choose Your
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Trading Plan</span>
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Start with any amount and scale up as your profits grow. All plans include professional trading management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div key={index} className={`relative bg-slate-800 border-2 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 ${plan.popular ? 'border-blue-500 bg-gradient-to-br from-blue-900/20 to-purple-900/20' : 'border-slate-700 hover:border-blue-500/50'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </div>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-blue-400 mb-2">{plan.price}</div>
                  <div className="text-slate-400">Minimum Deposit</div>
                  <div className="mt-4 inline-block bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
                    <span className="text-green-400 font-semibold">{plan.returns} Monthly Returns</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-slate-300">
                      <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/signup" 
                  className={`block w-full text-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-blue-500/25' : 'bg-slate-700 hover:bg-slate-600 text-white border border-slate-600'}`}
                >
                  Get Started Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Real Results from
              <span className="block bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Real Traders</span>
            </h2>
            <p className="text-xl text-slate-300">
              See how our traders are building wealth with our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-white">{testimonial.name}</div>
                    <div className="text-slate-400 text-sm">{testimonial.location}</div>
                  </div>
                  <div className="ml-auto">
                    <div className="text-green-400 font-bold text-lg">{testimonial.profit}</div>
                    <div className="text-slate-500 text-xs">Total Profit</div>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-slate-300 mb-6 italic leading-relaxed">
                  "{testimonial.comment}"
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-slate-500 text-sm">
                    Verified Trader
                  </div>
                  <div className="flex items-center text-blue-400">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    <span className="text-sm">Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Questions</span>
            </h2>
            <p className="text-xl text-slate-300">
              Everything you need to know about trading with us
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-slate-700 border border-slate-600 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                  <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                </div>
                <p className="text-slate-300 mt-4 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/10"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Start Your
            <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Wealth Journey?
            </span>
          </h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Join thousands of successful traders and start earning consistent profits today. 
            <span className="block mt-2 text-lg">Your financial future starts with a single click.</span>
          </p>
          
          {/* Urgency Elements */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2">
              <Zap className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-green-300">Start Trading in 5 Minutes</span>
            </div>
            <div className="flex items-center bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2">
              <Award className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-blue-300">No Experience Required</span>
            </div>
            <div className="flex items-center bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
              <Shield className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-purple-300">100% Secure & Insured</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup" className="group bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all duration-300 shadow-2xl hover:shadow-green-500/25 transform hover:scale-105">
              <span className="flex items-center justify-center">
                Start Trading Now - It's Free
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
            <Link to="/login" className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-4 px-8 rounded-xl text-lg transition-all duration-300">
              Login to Dashboard
            </Link>
          </div>
          
          {/* Trust Signals */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-400">
            <div className="flex items-center">
              <Phone className="h-5 w-5 text-blue-400 mr-2" />
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm">Instant Setup</span>
            </div>
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-purple-400 mr-2" />
              <span className="text-sm">SSL Secured</span>
            </div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
      </section>
    </div>
  );
};

export default LandingPage;
