import { useState } from 'react';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  QrCode, 
  User, 
  ChevronRight,
  ArrowUpRight,
  Info,
  Shield,
  Clock
} from 'lucide-react';

const Send = ({ user, setUser }) => {
  const [recipient, setRecipient] = useState('john.carter@email.com');
  const [selectedAsset, setSelectedAsset] = useState('ETH');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('Ethereum');
  const [showConfirm, setShowConfirm] = useState(false);

  const assets = [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      balance: 0.0042,
      icon: 'Ξ',
      color: 'from-blue-500 to-blue-600'
    },
    {
      symbol: 'STA',
      name: 'STA Max',
      balance: 453265,
      icon: 'S',
      color: 'from-purple-500 to-purple-600'
    },
    {
      symbol: 'BTC',
      name: 'Bitcoin',
      balance: 0.0012,
      icon: '₿',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const selectedAssetData = assets.find(asset => asset.symbol === selectedAsset);

  const formatBalance = (balance, symbol) => {
    if (symbol === 'ETH' || symbol === 'BTC') {
      return `${balance} ${symbol}`;
    }
    return balance.toLocaleString();
  };

  const calculateFees = () => {
    return 0.001; // Mock fee calculation
  };

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const fees = calculateFees();
    return amountNum + fees;
  };

  const handleSend = () => {
    // Mock send transaction
    console.log('Sending transaction:', {
      recipient,
      asset: selectedAsset,
      amount: parseFloat(amount),
      network
    });
    setShowConfirm(true);
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="text-xl font-bold text-white">Send</h1>
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Recipient Section */}
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            To:
          </label>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{recipient}</div>
                  <div className="text-slate-400 text-sm">Email address</div>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-white transition-colors">
                <QrCode className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Asset Selection */}
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Select Asset
          </label>
          <div className="space-y-3">
            {assets.map((asset) => (
              <div
                key={asset.symbol}
                onClick={() => setSelectedAsset(asset.symbol)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAsset === asset.symbol
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-br ${asset.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                      {asset.icon}
                    </div>
                    <div>
                      <div className="text-white font-medium">{asset.name}</div>
                      <div className="text-slate-400 text-sm">
                        {formatBalance(asset.balance, asset.symbol)} available
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Amount
          </label>
          <div className="bg-slate-800 rounded-xl p-4 border border-slate-700">
            <div className="flex items-center justify-between">
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-white text-2xl font-bold placeholder-slate-500 border-0 focus:ring-0 w-full"
              />
              <div className="text-slate-400 text-sm">
                {selectedAsset}
              </div>
            </div>
            <div className="text-slate-400 text-sm mt-2">
              ≈ ${(parseFloat(amount) * 1825).toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="bg-slate-800 rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Transaction Details</h3>
            <div className="flex items-center space-x-2 text-slate-400">
              <Shield className="h-4 w-4" />
              <span className="text-sm">Secure</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Network</span>
              <span className="text-white text-sm">{network}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Network Fee</span>
              <span className="text-white text-sm">{calculateFees()} {selectedAsset}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Time</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-white text-sm">2-5 minutes</span>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Total</span>
                <span className="text-white font-bold">
                  {calculateTotal().toFixed(4)} {selectedAsset}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > selectedAssetData.balance}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowUpRight className="h-5 w-5" />
          <span>Send {selectedAsset}</span>
        </button>

        {/* Info Section */}
        <div className="mt-6 bg-blue-600/10 border border-blue-600/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <h4 className="text-blue-300 font-medium mb-1">Important Notice</h4>
              <p className="text-blue-200 text-sm">
                Please double-check the recipient address. Transactions cannot be reversed once sent.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowUpRight className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Transaction Sent!</h3>
              <p className="text-slate-300 text-sm mb-6">
                Your {selectedAsset} has been sent to {recipient}
              </p>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Send;
