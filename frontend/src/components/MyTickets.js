import { useState, useEffect } from 'react';
import { useReadContract, useBlockNumber } from 'wagmi';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';

export default function MyTickets({ address, currentDraw }) {
  const [myTickets, setMyTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get the last request ID to check for winning numbers
  const { data: lastRequestId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'lastRequestId',
  });

  // Get the request status to see if we have winning numbers
  const { data: requestStatus } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getRequestStatus',
    args: [lastRequestId || 0n],
    enabled: !!lastRequestId && lastRequestId > 0n,
  });

  // Helper function to unpack numbers from packed uint256
  const unpackNumbers = (packed) => {
    const numbers = [];
    for (let i = 0; i < 7; i++) {
      const num = Number((BigInt(packed) >> BigInt(i * 8)) & BigInt(0xFF));
      numbers.push(num);
    }
    return numbers;
  };

  // Fetch tickets by reading the tickets array
  // Note: This is inefficient for large arrays, but works for demo purposes
  useEffect(() => {
    const fetchTickets = async () => {
      if (!address) {
        setMyTickets([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const userTickets = [];

      // We'll try to read up to 100 tickets (adjust based on expected volume)
      // In production, you'd want events or a subgraph for this
      try {
        for (let i = 0; i < 100; i++) {
          try {
            // Read ticket from contract using the public tickets array
            const response = await fetch('/api/readTicket', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ index: i })
            });

            // Since we don't have an API, we'll use a simpler approach
            // Just show a message that tickets will appear after purchase
            break;
          } catch (error) {
            // Reached end of array
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }

      setMyTickets(userTickets);
      setIsLoading(false);
    };

    fetchTickets();
  }, [address, currentDraw]);

  const winningNumbers = requestStatus && requestStatus[0] ? requestStatus[1] : null;
  const hasWinningNumbers = winningNumbers && winningNumbers.length > 0 && winningNumbers[0] !== 0n;

  const countMatches = (ticketNumbers, winningNums) => {
    if (!winningNums || winningNums.length === 0) return 0;
    let matches = 0;
    for (let i = 0; i < 7; i++) {
      if (ticketNumbers[i] === Number(winningNums[i])) {
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

  // For now, show a simplified view since we can't easily read all tickets
  return (
    <div className="space-y-6">
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
        <h2 className="text-2xl font-bold text-white mb-6">
          My Tickets for Draw #{currentDraw?.toString() || '0'}
        </h2>

        {hasWinningNumbers && (
          <div className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4">
            <h3 className="text-white font-semibold mb-2">🎉 Winning Numbers</h3>
            <div className="flex space-x-2">
              {winningNumbers.map((num, i) => (
                <div key={i} className="lottery-ball">
                  {Number(num)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-6 text-center">
          <p className="text-yellow-400 font-semibold mb-2">
            📋 Ticket History Coming Soon
          </p>
          <p className="text-yellow-300 text-sm">
            The contract currently doesn't have helper functions to retrieve your tickets.
            Your tickets are stored on-chain and will be checked for prizes automatically when the draw completes.
          </p>
          {hasWinningNumbers && (
            <p className="text-yellow-300 text-sm mt-2">
              If you won, your prize has been automatically sent to your wallet!
            </p>
          )}
        </div>

        <div className="mt-6 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-lg p-4">
          <p className="text-blue-300 text-sm">
            💡 Tip: Check the "Entered" events in the contract to see your ticket purchases.
          </p>
        </div>
      </div>
    </div>
  );
}

