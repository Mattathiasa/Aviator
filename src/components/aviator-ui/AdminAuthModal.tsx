import { useState } from 'react';

interface AdminAuthModalProps {
  onAuthenticate: (password: string) => void;
  onClose: () => void;
  error?: string;
}

export const AdminAuthModal = ({ onAuthenticate, onClose, error }: AdminAuthModalProps) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!password.trim()) return;
    setIsLoading(true);
    onAuthenticate(password);
    // Reset loading after a delay (will be handled by parent component)
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1C1C1C] rounded-2xl p-6 max-w-md w-full border border-gray-800">
        <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
          Admin Login
        </h2>
        <p className="text-gray-400 mb-4">
          Enter admin password to access balance management
        </p>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
        
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Admin password..."
          className="w-full bg-[#0F0F0F] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#00FF80] focus:outline-none mb-4"
        />
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-600 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!password.trim() || isLoading}
            className="flex-1 bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-bold py-3 rounded-xl disabled:opacity-50"
          >
            {isLoading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
};
