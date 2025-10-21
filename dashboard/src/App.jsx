import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './pages/Overview';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Deposits from './pages/Deposits';
import Withdrawals from './pages/Withdrawals';
import Wallets from './pages/Wallets';
import Logs from './pages/Logs';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetail />} />
                <Route path="/deposits" element={<Deposits />} />
                <Route path="/withdrawals" element={<Withdrawals />} />
                <Route path="/wallets" element={<Wallets />} />
                <Route path="/logs" element={<Logs />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
