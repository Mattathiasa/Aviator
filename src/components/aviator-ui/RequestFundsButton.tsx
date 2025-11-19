import { useState } from 'react';

interface RequestFundsButtonProps {
  balance: number;
  onRequestFunds: (amount?: number) => void;
  isPending: boolean;
}

export const RequestFundsButton = ({ balance, onRequestFunds, isPending }: RequestFundsButtonProps) => {
  const [showModal, setShowModal] = useState(false);
  const [amount, setAmount] = useState('');

  const handleRequest = () => {
    const requestAmount = amount ? parseFloat(amount) : undefined;
    onRequestFunds(requestAmount);
    setShowModal(false);
    setAmount('');
  };

  if (balance > 0 && !isPending) return null;

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        disabled={isPending}
        className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
          isPending
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black hover:opacity-90'
        }`}
      >
        {isPending ? 'Request Pending...' : 'Request Funds'}
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1C1C1C] rounded-2xl p-6 max-w-md w-full border border-gray-800">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-red-500 bg-clip-text text-transparent">
              Request Funds
            </h2>
            <p className="text-gray-400 mb-4">
              Request balance from an admin to start playing
            </p>
            <div className="mb-4">
              <label className="text-gray-400 text-sm mb-2 block">
                Amount (optional)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount..."
                min="1"
                max="10000"
                className="w-full bg-[#0F0F0F] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-[#00FF80] focus:outline-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-700 text-white font-bold py-3 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleRequest}
                className="flex-1 bg-gradient-to-r from-[#00FF80] to-[#00CC66] text-black font-bold py-3 rounded-xl hover:opacity-90"
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
