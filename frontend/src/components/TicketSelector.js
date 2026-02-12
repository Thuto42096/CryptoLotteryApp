import { useState } from 'react';

export default function TicketSelector({ selectedNumbers, setSelectedNumbers, onAddTicket }) {
  const [error, setError] = useState('');

  const handleNumberClick = (num) => {
    setError('');
    
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 7) {
      const newNumbers = [...selectedNumbers, num].sort((a, b) => a - b);
      setSelectedNumbers(newNumbers);
    } else {
      setError('You can only select 7 numbers');
    }
  };

  const handleQuickPick = () => {
    const numbers = [];
    while (numbers.length < 7) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
    setError('');
  };

  const handleClear = () => {
    setSelectedNumbers([]);
    setError('');
  };

  const handleAddTicket = () => {
    if (selectedNumbers.length === 7) {
      onAddTicket();
      setError('');
    } else {
      setError('Please select exactly 7 numbers');
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
      <h2 className="text-2xl font-bold text-white mb-4">Select Your Numbers (1-49)</h2>
      
      {/* Selected Numbers Display */}
      <div className="mb-6 bg-black bg-opacity-30 rounded-lg p-4">
        <p className="text-sm text-gray-300 mb-2">Selected Numbers ({selectedNumbers.length}/7)</p>
        <div className="flex space-x-2 min-h-[48px] items-center">
          {selectedNumbers.length === 0 ? (
            <p className="text-gray-400 italic">Click numbers below to select</p>
          ) : (
            selectedNumbers.map((num, index) => (
              <div key={index} className="lottery-ball">
                {num}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Number Grid */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num)}
            className={`w-full aspect-square rounded-lg font-bold text-lg transition-all ${
              selectedNumbers.includes(num)
                ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white scale-110 shadow-lg'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30 hover:scale-105'
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg p-3">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={handleQuickPick}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          🎲 Quick Pick
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleAddTicket}
          disabled={selectedNumbers.length !== 7}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add Ticket
        </button>
      </div>

      <div className="mt-4 text-sm text-gray-300">
        <p>💡 Tip: Numbers must match the winning numbers in the exact position to win!</p>
        <p>💰 Each correct position = 5% of the prize pool</p>
      </div>
    </div>
  );
}

