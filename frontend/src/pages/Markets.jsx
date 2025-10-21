import { useState, useEffect } from 'react';
import { 
  Search, 
  Star, 
  TrendingUp, 
  TrendingDown,
  Filter,
  ChevronDown,
  Fire,
  BarChart3
} from 'lucide-react';

const Markets = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock market data - in real app, this would come from API
  const mockMarkets = [
    {
      id: 1,
      symbol: 'BTC',
      name: 'Bitcoin',
      price: 63807.40,
      change: 0.98,
      change24h: 0.98,
      volume: '2.4B',
      marketCap: '1.2T',
      icon: '₿'
    },
    {
      id: 2,
      symbol: 'ETH',
      name: 'Ethereum',
      price: 1825.26,
      change: 0.799,
      change24h: 0.799,
      volume: '1.8B',
      marketCap: '220B',
      icon: 'Ξ'
    },
    {
      id: 3,
      symbol: 'OKB',
      name: 'OKB',
      price: 45.32,
      change: 2.15,
      change24h: 2.15,
      volume: '120M',
      marketCap: '2.7B',
      icon: 'O'
    },
    {
      id: 4,
      symbol: 'MATIC',
      name: 'Polygon',
      price: 0.85,
      change: 1.42,
      change24h: 1.42,
      volume: '89M',
      marketCap: '8.1B',
      icon: 'M'
    },
    {
      id: 5,
      symbol: 'XRP',
      name: 'Ripple',
      price: 0.52,
      change: 0.65,
      change24h: 0.65,
      volume: '156M',
      marketCap: '29B',
      icon: 'X'
    },
    {
      id: 6,
      symbol: 'SOL',
      name: 'Solana',
      price: 98.45,
      change: 3.21,
      change24h: 3.21,
      volume: '234M',
      marketCap: '42B',
      icon: 'S'
    },
    {
      id: 7,
      symbol: 'DOGE',
      name: 'Dogecoin',
      price: 0.08,
      change: 1.85,
      change24h: 1.85,
      volume: '67M',
      marketCap: '11B',
      icon: 'Ð'
    },
    {
      id: 8,
      symbol: 'PEPE',
      name: 'Pepe',
      price: 0.0000012,
      change: 5.67,
      change24h: 5.67,
      volume: '45M',
      marketCap: '1.2B',
      icon: 'P'
    }
  ];

  const tabs = ['All', 'Favorites', 'Top', 'Layer 1', 'Layer 2', 'M'];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setMarkets(mockMarkets);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredMarkets = markets.filter(market =>
    market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    market.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    if (price < 0.01) {
      return `$${price.toExponential(2)}`;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 4 : 2
    }).format(price);
  };

  const formatChange = (change) => {
    const isPositive = change >= 0;
    return {
      value: `${isPositive ? '+' : ''}${change.toFixed(2)}%`,
      color: isPositive ? 'text-green-400' : 'text-red-400',
      bgColor: isPositive ? 'bg-green-600/20' : 'bg-red-600/20'
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">Markets</h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <Filter className="h-5 w-5" />
              </button>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <BarChart3 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search coins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 border-0 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-1 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {tab === 'Favorites' && <Star className="h-4 w-4" />}
                {tab === 'Top' && <Fire className="h-4 w-4" />}
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Market List */}
      <div className="px-4 py-4">
        <div className="space-y-2">
          {filteredMarkets.map((market) => {
            const change = formatChange(market.change);
            return (
              <div
                key={market.id}
                className="bg-slate-800 rounded-xl p-4 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {market.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{market.symbol}</div>
                      <div className="text-slate-400 text-sm">{market.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-white font-semibold">
                      {formatPrice(market.price)}
                    </div>
                    <div className={`text-sm font-medium ${change.color}`}>
                      {change.value}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-700 rounded-full p-4 w-fit mx-auto mb-4">
              <Search className="h-8 w-8 text-slate-400" />
            </div>
            <p className="text-slate-300 mb-2">No coins found</p>
            <p className="text-slate-400 text-sm">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Placeholder */}
      <div className="h-20"></div>
    </div>
  );
};

export default Markets;
