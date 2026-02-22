import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export default function DrawHistory({ currentDraw }) {
  const [selectedRequestIndex, setSelectedRequestIndex] = useState(0);

  // Get the last request ID
  const { data: lastRequestId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'lastRequestId',
  });

  // Get the selected request ID from the requestIds array
  const { data: selectedRequestId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'requestIds',
    args: [BigInt(selectedRequestIndex)],
    enabled: lastRequestId && lastRequestId > 0n,
  });

  // Get the request status for the selected request
  const { data: requestStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRequestStatus',
    args: [selectedRequestId || 0n],
    enabled: !!selectedRequestId && selectedRequestId > 0n,
  });

  const winningNumbers = requestStatus && requestStatus[0] ? requestStatus[1] : null;
  const hasResults = winningNumbers && winningNumbers.length > 0 && winningNumbers[0] !== 0n;

  if (!lastRequestId || lastRequestId === 0n) {
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
          <label className="block text-white font-semibold mb-2">Select Past Draw</label>
          <select
            value={selectedRequestIndex}
            onChange={(e) => setSelectedRequestIndex(Number(e.target.value))}
            className="w-full bg-black bg-opacity-50 text-white border border-white border-opacity-30 rounded-lg px-4 py-2 focus:outline-none focus:border-yellow-400"
          >
            <option value={0}>Most Recent Draw</option>
            {/* Note: In production, you'd want to know the total number of requests */}
          </select>
        </div>

        {hasResults ? (
          <div className="space-y-6">
            {/* Winning Numbers */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6">
              <h3 className="text-white font-bold text-xl mb-4">🎉 Winning Numbers</h3>
              <div className="flex space-x-3 justify-center">
                {winningNumbers.map((num, i) => (
                  <div key={i} className="lottery-ball text-2xl w-16 h-16">
                    {Number(num)}
                  </div>
                ))}
              </div>
            </div>

            {/* Prize Breakdown */}
            <div className="bg-black bg-opacity-30 rounded-lg p-6">
              <h3 className="text-white font-bold text-lg mb-4">💰 Prize Distribution</h3>
              <div className="space-y-2 text-white text-sm">
                <div className="flex justify-between">
                  <span>7 Matches</span>
                  <span className="font-bold text-green-400">30% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span>6 Matches</span>
                  <span className="font-bold text-blue-400">20% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span>5 Matches</span>
                  <span className="font-bold text-purple-400">20% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span>4 Matches</span>
                  <span className="font-bold text-yellow-400">15% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span>3 Matches</span>
                  <span className="font-bold text-orange-400">10% of pool</span>
                </div>
                <div className="flex justify-between">
                  <span>2 Matches</span>
                  <span className="font-bold text-pink-400">5% of pool</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
              <p className="text-blue-300 text-sm">
                💡 Request ID: {selectedRequestId?.toString()}
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-6 text-center">
            <p className="text-yellow-400 font-semibold">
              ⏳ Draw results are not available yet or still pending.
            </p>
            <p className="text-yellow-300 text-sm mt-2">
              The draw may not have been executed yet, or the random numbers are still being generated by Chainlink VRF.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

