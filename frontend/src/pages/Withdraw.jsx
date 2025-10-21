import { useState } from 'react';
import { userAPI } from '../utils/api';
import { 
  ArrowLeft, 
  MoreHorizontal, 
  QrCode, 
  User, 
  ChevronRight,
  ArrowUpRight,
  Info,
  Shield,
  Clock,
  AlertCircle
} from 'lucide-react';

const Withdraw = ({ user, setUser }) => {
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    routingNumber: ''
  });
  const [cryptoDetails, setCryptoDetails] = useState({
    walletAddress: '',
    network: 'Ethereum'
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const withdrawalMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      description: 'Direct bank transfer (1-3 business days)',
      icon: '🏦',
      fee: 0.5
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'Withdraw to crypto wallet',
      icon: '₿',
      fee: 0.1
    },
    {
      id: 'paypal',
      name: 'PayPal',
      description: 'Withdraw to PayPal account',
      icon: '💳',
      fee: 2.5
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const calculateFees = () => {
    const method = withdrawalMethods.find(m => m.id === withdrawalMethod);
    const amountNum = parseFloat(amount) || 0;
    return method ? (amountNum * method.fee / 100) : 0;
  };

  const calculateTotal = () => {
    const amountNum = parseFloat(amount) || 0;
    const fees = calculateFees();
    return amountNum + fees;
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > user.balance) {
      alert('Insufficient balance');
      return;
    }

    setLoading(true);
    try {
      const withdrawalData = {
        amount: parseFloat(amount),
        method: withdrawalMethod,
        ...(withdrawalMethod === 'bank' ? bankDetails : {}),
        ...(withdrawalMethod === 'crypto' ? cryptoDetails : {})
      };

      await userAPI.withdraw(withdrawalData);
      setShowConfirm(true);
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal request failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
              <h1 className="text-xl font-bold text-white">Withdraw</h1>
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Balance Display */}
        <div className="mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <div className="text-blue-100 text-sm mb-2">Available Balance</div>
            <div className="text-3xl font-bold mb-2">{formatCurrency(user.balance)}</div>
            <div className="text-blue-200 text-sm">Ready for withdrawal</div>
          </div>
        </div>

        {/* Withdrawal Method Selection */}
        <div className="mb-6">
          <label className="block text-slate-300 text-sm font-medium mb-2">
            Withdrawal Method
          </label>
          <div className="space-y-3">
            {withdrawalMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setWithdrawalMethod(method.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  withdrawalMethod === method.id
                    ? 'border-blue-500 bg-blue-600/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{method.icon}</div>
                    <div>
                      <div className="text-white font-medium">{method.name}</div>
                      <div className="text-slate-400 text-sm">{method.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-slate-400 text-sm">Fee: {method.fee}%</div>
                  </div>
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
                USD
              </div>
            </div>
            <div className="text-slate-400 text-sm mt-2">
              Max: {formatCurrency(user.balance)}
            </div>
          </div>
        </div>

        {/* Withdrawal Details */}
        {withdrawalMethod === 'bank' && (
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Bank Details
            </label>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 space-y-4">
              <input
                type="text"
                placeholder="Account Name"
                value={bankDetails.accountName}
                onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Account Number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Bank Name"
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Routing Number"
                value={bankDetails.routingNumber}
                onChange={(e) => setBankDetails({...bankDetails, routingNumber: e.target.value})}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        )}

        {withdrawalMethod === 'crypto' && (
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Crypto Wallet Details
            </label>
            <div className="bg-slate-800 rounded-xl p-4 border border-slate-700 space-y-4">
              <input
                type="text"
                placeholder="Wallet Address"
                value={cryptoDetails.walletAddress}
                onChange={(e) => setCryptoDetails({...cryptoDetails, walletAddress: e.target.value})}
                className="w-full bg-slate-700 text-white placeholder-slate-400 rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={cryptoDetails.network}
                onChange={(e) => setCryptoDetails({...cryptoDetails, network: e.target.value})}
                className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 border border-slate-600 focus:ring-2 focus:ring-blue-500"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="Tron">Tron</option>
                <option value="BSC">BSC</option>
              </select>
            </div>
          </div>
        )}

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
              <span className="text-slate-400 text-sm">Method</span>
              <span className="text-white text-sm">
                {withdrawalMethods.find(m => m.id === withdrawalMethod)?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Processing Fee</span>
              <span className="text-white text-sm">{formatCurrency(calculateFees())}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Estimated Time</span>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-white text-sm">
                  {withdrawalMethod === 'bank' ? '1-3 business days' : 
                   withdrawalMethod === 'crypto' ? '1-24 hours' : '1-2 business days'}
                </span>
              </div>
            </div>
            <div className="border-t border-slate-700 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 font-medium">Total</span>
                <span className="text-white font-bold">
                  {formatCurrency(calculateTotal())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Button */}
        <button
          onClick={handleWithdraw}
          disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > user.balance || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors flex items-center justify-center space-x-2"
        >
          <ArrowUpRight className="h-5 w-5" />
          <span>{loading ? 'Processing...' : 'Request Withdrawal'}</span>
        </button>

        {/* Info Section */}
        <div className="mt-6 bg-yellow-600/10 border border-yellow-600/20 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div>
              <h4 className="text-yellow-300 font-medium mb-1">Withdrawal Notice</h4>
              <p className="text-yellow-200 text-sm">
                All withdrawal requests require admin approval. Processing time: 1-3 business days for bank transfers, 1-24 hours for crypto withdrawals.
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
              <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Withdrawal Requested!</h3>
              <p className="text-slate-300 text-sm mb-6">
                Your withdrawal request for {formatCurrency(parseFloat(amount))} has been submitted and is pending admin approval.
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

export default Withdraw;