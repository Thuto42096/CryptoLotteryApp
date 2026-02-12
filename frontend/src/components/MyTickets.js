import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '@/utils/contract';

export default function MyTickets({ address, currentDraw }) {
  const { data: tickets, isLoading } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getTicketsByDrawForPlayer',
    args: [address, currentDraw],
    enabled: !!address && !!currentDraw,
  });

  const { data: draw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getDraw',
    args: [currentDraw],
    enabled: !!currentDraw,
  });

  const countMatches = (ticketNumbers, winningNumbers) => {
    if (!winningNumbers || winningNumbers.length === 0) return 0;
    let matches = 0;
    for (let i = 0; i < 7; i++) {
      if (ticketNumbers[i] === winningNumbers[i]) {
        matches++;
      }
    }
    return matches;
  };

  if (isLoading) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-12 text-center border border-white border-opacity-20">
        <p className="text-white text-lg">Loading your tickets...</p>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-12 text-center border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-white mb-4">No Tickets Yet</h2>
        <p className="text-gray-300">You haven't purchased any tickets for the current draw.</p>
      </div>
    );
  }

  const hasWinningNumbers = draw && draw.winningNumbers && draw.winningNumbers.length > 0 && draw.winningNumbers[0] !== 0;

  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-white mb-6">
          My Tickets for Draw #{currentDraw?.toString()}
        </h2>

        {hasWinningNumbers && (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">🎉 Winning Numbers</h3>
            <div className="flex space-x-2">
              {draw.winningNumbers.map((num, i) => (
                <div key={i} className="lottery-ball">
                  {num}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-4">
          {tickets.map((ticket, index) => {
            const matches = hasWinningNumbers ? countMatches(ticket.numbers, draw.winningNumbers) : 0;
            const isWinner = matches > 0;

            return (
              <div
                key={index}
                className={`rounded-lg p-4 border-2 ${
                  isWinner
                    ? 'bg-green-500 bg-opacity-20 border-green-500'
                    : 'bg-black bg-opacity-30 border-white border-opacity-20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {ticket.numbers.map((num, i) => {
                      const isMatch = hasWinningNumbers && num === draw.winningNumbers[i];
                      return (
                        <div
                          key={i}
                          className={`lottery-ball ${
                            isMatch ? 'ring-4 ring-yellow-400' : ''
                          }`}
                        >
                          {num}
                        </div>
                      );
                    })}
                  </div>
                  {hasWinningNumbers && (
                    <div className="text-right">
                      {isWinner ? (
                        <div>
                          <p className="text-green-400 font-bold text-lg">
                            🎉 {matches} Match{matches > 1 ? 'es' : ''}!
                          </p>
                          <p className="text-green-300 text-sm">
                            Prize: {matches * 5}% of pool
                          </p>
                        </div>
                      ) : (
                        <p className="text-gray-400">No matches</p>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Purchased: {new Date(Number(ticket.timestamp) * 1000).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-6 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 You have {tickets.length} ticket{tickets.length > 1 ? 's' : ''} for this draw.
            {!hasWinningNumbers && ' Results will appear here after the draw.'}
          </p>
        </div>
      </div>
    </div>
  );
}

