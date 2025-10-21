import { useState, useEffect } from 'react';
import { adminAPI } from '../utils/api';
import { Table, TableHeader, TableHeaderCell, TableBody, TableRow, TableCell } from '../components/Table';
import Modal from '../components/Modal';
import { Wallet, Edit, Plus, Copy, CheckCircle } from 'lucide-react';

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [formData, setFormData] = useState({
    currency: '',
    network: '',
    address: '',
    adminName: 'Admin'
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await adminAPI.getWalletAddresses();
      setWallets(response.data.wallets || []);
    } catch (error) {
      console.error('Error fetching wallets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (wallet) => {
    setEditingWallet(wallet);
    setFormData({
      currency: wallet.currency,
      network: wallet.network,
      address: wallet.address,
      adminName: 'Admin'
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingWallet(null);
    setFormData({
      currency: '',
      network: '',
      address: '',
      adminName: 'Admin'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setMessage('');

    try {
      await adminAPI.updateWalletAddress(formData);
      setMessage('Wallet address updated successfully');
      setShowModal(false);
      fetchWallets();
    } catch (error) {
      setMessage('Failed to update wallet address');
    } finally {
      setActionLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('Address copied to clipboard!');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Crypto Wallet Management</h1>
          <p className="text-gray-600 mt-1">Manage cryptocurrency deposit addresses</p>
        </div>
        <button
          onClick={handleAdd}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Wallet</span>
        </button>
      </div>

      {message && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {/* Wallets Table */}
      <div className="card">
        {wallets.length === 0 ? (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No wallet addresses configured</p>
            <button
              onClick={handleAdd}
              className="btn-primary mt-4"
            >
              Add First Wallet
            </button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableHeaderCell>Currency</TableHeaderCell>
              <TableHeaderCell>Network</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Last Updated</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableHeader>
            <TableBody>
              {wallets.map((wallet) => (
                <TableRow key={wallet._id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-bold text-primary-600">
                          {wallet.currency.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{wallet.currency}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">{wallet.network}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono max-w-xs truncate">
                        {wallet.address}
                      </code>
                      <button
                        onClick={() => copyToClipboard(wallet.address)}
                        className="p-1 text-gray-500 hover:text-gray-700"
                        title="Copy address"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      {new Date(wallet.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      by {wallet.updatedBy}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleEdit(wallet)}
                      className="btn-secondary text-sm flex items-center space-x-1"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Edit/Add Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingWallet ? 'Edit Wallet Address' : 'Add Wallet Address'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="input-field"
              required
            >
              <option value="">Select Currency</option>
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="USDT">Tether (USDT)</option>
              <option value="USDC">USD Coin (USDC)</option>
              <option value="LTC">Litecoin (LTC)</option>
              <option value="BCH">Bitcoin Cash (BCH)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Network
            </label>
            <input
              type="text"
              value={formData.network}
              onChange={(e) => setFormData({ ...formData, network: e.target.value })}
              className="input-field"
              placeholder="e.g., Bitcoin, Ethereum, TRC20"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wallet Address
            </label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="input-field"
              rows="3"
              placeholder="Enter the wallet address..."
              required
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={actionLoading}
              className="btn-primary disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : (editingWallet ? 'Update Wallet' : 'Add Wallet')}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Wallets;
