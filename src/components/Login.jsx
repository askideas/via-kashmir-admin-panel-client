import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Shield } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
    } catch (error) {
      setError('Invalid credentials');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans p-6">
      <div className="bg-white w-full max-w-sm p-10 px-8 rounded-xl shadow-lg border border-slate-200">
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-indigo-500 text-white rounded-lg flex items-center justify-center mx-auto mb-5">
            <Shield size={20} strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-semibold text-slate-800 mb-1.5 tracking-tight">Via Kashmir</h1>
          <p className="text-sm text-slate-500 font-normal">Admin Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 text-sm text-center rounded-md">
              {error}
            </div>
          )}
          
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=" "
              required
              className="w-full pt-4 pb-1.5 border-0 bg-transparent text-sm font-normal text-slate-800 outline-none transition-all duration-200 peer"
            />
            <label 
              htmlFor="email"
              className="absolute top-4 left-0 text-sm text-slate-500 font-normal transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:font-medium peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-indigo-500 peer-[:not(:placeholder-shown)]:font-medium"
            >
              Email Address
            </label>
            <div className="absolute bottom-0 left-0 w-full h-px bg-slate-200 peer-focus:bg-indigo-500 transition-colors duration-200"></div>
          </div>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=" "
              required
              className="w-full pt-4 pb-1.5 border-0 bg-transparent text-sm font-normal text-slate-800 outline-none transition-all duration-200 peer"
            />
            <label 
              htmlFor="password"
              className="absolute top-4 left-0 text-sm text-slate-500 font-normal transition-all duration-200 pointer-events-none peer-focus:top-0 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:font-medium peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-indigo-500 peer-[:not(:placeholder-shown)]:font-medium"
            >
              Password
            </label>
            <div className="absolute bottom-0 left-0 w-full h-px bg-slate-200 peer-focus:bg-indigo-500 transition-colors duration-200"></div>
            <button
              type="button"
              className="absolute right-0 top-3 bg-transparent border-0 text-slate-500 cursor-pointer p-1.5 rounded-md transition-all duration-200 hover:text-indigo-500 hover:bg-slate-50"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="bg-indigo-500 text-white border-0 py-3.5 px-6 text-sm font-medium cursor-pointer rounded-lg transition-all duration-200 mt-2 hover:bg-indigo-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
