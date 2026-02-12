import { useReadContract } from 'wagmi';
import { formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/utils/contract';

export default function PrizePool({ prizePool }) {
  const { data: prizePoolUSD } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getPrizePoolInUSD',
  });

  return (
    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg p-6 shadow-xl">
      <h3 className="text-lg font-semibold text-white mb-2">💰 Prize Pool</h3>
      <p className="text-4xl font-bold text-white mb-1">
        {prizePool ? formatEther(prizePool) : '0'} ETH
      </p>
      {prizePoolUSD && (
        <p className="text-lg text-white text-opacity-90">
          ≈ ${(Number(prizePoolUSD) / 100).toFixed(2)} USD
        </p>
      )}
      <div className="mt-4 text-sm text-white text-opacity-80">
        <p>🎯 Match all 7 positions: 35% of pool</p>
        <p>🎯 Match 6 positions: 30% of pool</p>
        <p>🎯 Match 5 positions: 25% of pool</p>
      </div>
    </div>
  );
}

