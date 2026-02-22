import { formatEther } from 'viem';

export default function PrizePool({ prizePool }) {
  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-2">💰 Prize Pool</h3>
      <p className="text-4xl font-bold text-white mb-1">
        {prizePool ? formatEther(prizePool) : '0'} ETH
      </p>
      <div className="mt-4 text-sm text-white text-opacity-80">
        <p>🎯 7 Matches: 30% of pool</p>
        <p>🎯 6 Matches: 20% of pool</p>
        <p>🎯 5 Matches: 20% of pool</p>
        <p>🎯 4 Matches: 15% of pool</p>
        <p>🎯 3 Matches: 10% of pool</p>
        <p>🎯 2 Matches: 5% of pool</p>
      </div>
    </div>
  );
}

