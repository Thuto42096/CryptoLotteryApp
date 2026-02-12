import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/utils/contract';

export default function DrawHistory({ currentDraw }) {
  const [selectedDraw, setSelectedDraw] = useState(null);

  const { data: draw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getDraw',
    args: [selectedDraw || (currentDraw ? currentDraw - 1n : 0n)],
    enabled: !!currentDraw && currentDraw > 1n,
  });

  const drawNumber = selectedDraw || (currentDraw ? currentDraw - 1n : 0n);
  const hasResults = draw && draw.winningNumbers && draw.winningNumbers.length > 0 && draw.winningNumbers[0] !== 0;

  if (!currentDraw || currentDraw <= 1n) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-12 text-center border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-white mb-4">No Draw History Yet</h2>
        <p className="text-gray-300">The first draw hasn't been completed yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-white mb-6">Draw History</h2>

        {/* Draw Selector */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-2">Select Draw</label>
          <select
            value={drawNumber.toString()}
            onChange={(e) => setSelectedDraw(BigInt(e.target.value))}
            className="w-full bg-black bg-opacity-50 text-white border border-white border-opacity-30 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400"
          >
            {Array.from({ length: Number(currentDraw) - 1 }, (_, i) => Number(currentDraw) - 1 - i).map((num) => (
              <option key={num} value={num}>
                Draw #{num}
              </option>
            ))}
          </select>
        </div>

        {hasResults ? (
          <div className="space-y-6">
            {/* Winning Numbers */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6">
              <h3 className="text-white font-bold text-xl mb-4">🎉 Winning Numbers</h3>
              <div className="flex space-x-3 justify-center">
                {draw.winningNumbers.map((num, i) => (
                  <div key={i} className="lottery-ball text-2xl w-16 h-16">
                    {num}
                  </div>
                ))}
              </div>
            </div>

            {/* Draw Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Prize Pool</p>
                <p className="text-white font-bold text-xl">
                  {formatEther(draw.prizePool)} ETH
                </p>
              </div>

              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Total Tickets</p>
                <p className="text-white font-bold text-xl">
                  {draw.totalTickets.toString()}
                </p>
              </div>

              <div className="bg-black bg-opacity-30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-1">Draw Date</p>
                <p className="text-white font-bold text-lg">
                  {new Date(Number(draw.timestamp) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Prize Breakdown */}
            <div className="bg-black bg-opacity-30 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4">💰 Prize Breakdown</h3>
              <div className="space-y-2 text-white">
                <div className="flex justify-between">
                  <span>7 Matches (All positions)</span>
                  <span className="font-bold text-green-400">
                    {formatEther((draw.prizePool * 35n) / 100n)} ETH (35%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>6 Matches</span>
                  <span className="font-bold text-blue-400">
                    {formatEther((draw.prizePool * 30n) / 100n)} ETH (30%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>5 Matches</span>
                  <span className="font-bold text-purple-400">
                    {formatEther((draw.prizePool * 25n) / 100n)} ETH (25%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>4 Matches</span>
                  <span className="font-bold text-yellow-400">
                    {formatEther((draw.prizePool * 20n) / 100n)} ETH (20%)
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>Each match = 5% of prize pool</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-6 text-center">
            <p className="text-yellow-400 font-semibold">
              ⏳ Draw #{drawNumber.toString()} results are not available yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

