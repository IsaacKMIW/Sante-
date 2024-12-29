import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, CreditCard } from 'lucide-react';
import { signIn, getRedirectPath } from '../../lib/services/auth';
import { useAuthStore } from '../../lib/store/authStore';
import PasswordInput from '../common/PasswordInput';

const ARIA_LABELS = {
  emailMethod: 'Se connecter avec email',
  rfidMethod: 'Se connecter avec carte RFID',
  loading: 'Chargement en cours',
  error: 'Erreur de connexion'
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'rfid'>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    let redirectPath = '/';

    try {
      const user = await signIn(email, password);
      setUser(user);
      redirectPath = getRedirectPath(user.role);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
    } finally {
      setLoading(false);
      if (!error && redirectPath !== '/' && redirectPath) {
        navigate(redirectPath);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
      <div className="flex justify-center mb-6">
        <div 
          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4" 
          role="tablist"
          aria-label="Méthodes de connexion"
        >
          <button
            className={`flex items-center justify-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loginMethod === 'credentials'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setLoginMethod('credentials')}
            role="tab"
            aria-selected={loginMethod === 'credentials'}
            aria-controls="credentials-panel"
            aria-label={ARIA_LABELS.emailMethod}
          >
            <Mail className="w-5 h-5 mr-2" />
            Email
          </button>
          <button
            className={`flex items-center justify-center px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loginMethod === 'rfid'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setLoginMethod('rfid')}
            role="tab"
            aria-selected={loginMethod === 'rfid'}
            aria-controls="rfid-panel"
            aria-label={ARIA_LABELS.rfidMethod}
          >
            <CreditCard className="w-5 h-5 mr-2" />
            Carte RFID
          </button>
        </div>
      </div>

      {loginMethod === 'credentials' ? (
        <form 
          className="space-y-6" 
          onSubmit={handleSubmit}
          id="credentials-panel"
          role="tabpanel"
          aria-labelledby="credentials-tab"
        >
          {error && (
            <div 
              className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm"
              role="alert"
              aria-label={ARIA_LABELS.error}
            >
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                aria-required="true"
                aria-invalid={!!error}
                placeholder="vous@exemple.com"
              />
              <Mail className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <PasswordInput
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-required="true"
            aria-invalid={!!error}
            label="Mot de passe"
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
                aria-label="Se souvenir de moi"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Se souvenir de moi
              </label>
            </div>
            <a href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            aria-label={loading ? ARIA_LABELS.loading : undefined}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      ) : (
        <div className="text-center">
          <CreditCard className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <p className="text-gray-600">
            Veuillez présenter votre carte RFID devant le lecteur pour vous connecter.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;