import { useState, useEffect } from 'react';
import Head from 'next/head';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/contract';
import TicketSelector from '../components/TicketSelector';
import DrawHistory from '../components/DrawHistory';
import MyTickets from '../components/MyTickets';
import PrizePool from '../components/PrizePool';

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [activeTab, setActiveTab] = useState('buy');

  const { data: currentDraw } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'currentRoundId',
  });

  const { data: prizePool } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'prizePool',
  });

  const { data: ticketPrice } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'TICKET_PRICE',
  });

  const { data: roundEndTime } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'roundEndTime',
    watch: true,
  });

  // Calculate time until draw from roundEndTime
  const [timeUntilDraw, setTimeUntilDraw] = useState(0);

  useEffect(() => {
    if (!roundEndTime) return;

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const endTime = Number(roundEndTime);
      const remaining = Math.max(0, endTime - now);
      setTimeUntilDraw(remaining);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [roundEndTime]);

  const { writeContract, data: hash } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleAddTicket = () => {
    if (selectedNumbers.length === 7) {
      setTickets([...tickets, selectedNumbers]);
      setSelectedNumbers([]);
    }
  };

  const handleRemoveTicket = (index) => {
    setTickets(tickets.filter((_, i) => i !== index));
  };

  const handleBuyTickets = async () => {
    if (tickets.length === 0) {
      console.log('No tickets to buy');
      return;
    }

    console.log('Buying ticket with numbers:', tickets[0]);
    console.log('Ticket price:', ticketPrice?.toString());
    console.log('Contract address:', CONTRACT_ADDRESS);

    try {
      // The contract only supports buying one ticket at a time with the enter() function
      // For now, we'll just buy the first ticket
      // TODO: Implement sequential ticket purchases or update contract to support batch purchases
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'enter',
        args: [tickets[0]],
        value: ticketPrice,
      });
      console.log('Transaction submitted');
    } catch (error) {
      console.error('Error buying tickets:', error);
      alert('Error buying ticket: ' + error.message);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setTickets([]);
      setSelectedNumbers([]);
    }
  }, [isConfirmed]);

  const formatTime = (seconds) => {
    if (!seconds) return '0h 0m 0s';
    const hours = Math.floor(Number(seconds) / 3600);
    const minutes = Math.floor((Number(seconds) % 3600) / 60);
    const secs = Number(seconds) % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  return (
    <>
      <Head>
        <title>Crypto Lottery - Win Big with Blockchain</title>
        <meta name="description" content="Decentralized lottery powered by Chainlink VRF" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <nav className="bg-black bg-opacity-30 backdrop-blur-md border-b border-white border-opacity-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-white">🎰 Crypto Lottery</h1>
              <ConnectButton />
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Prize Pool and Draw Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <PrizePool prizePool={prizePool} />
            
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="text-lg font-semibold text-white mb-2">Current Draw</h3>
              <p className="text-4xl font-bold text-yellow-400">#{currentDraw?.toString() || '0'}</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
              <h3 className="text-lg font-semibold text-white mb-2">Next Draw In</h3>
              <p className="text-2xl font-bold text-green-400">{formatTime(timeUntilDraw)}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6">
            <div className="flex space-x-4 border-b border-white border-opacity-20">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'buy'
                    ? 'text-white border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Buy Tickets
              </button>
              <button
                onClick={() => setActiveTab('myTickets')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'myTickets'
                    ? 'text-white border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                My Tickets
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'history'
                    ? 'text-white border-b-2 border-yellow-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Draw History
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {!isConnected ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-12 text-center border border-white border-opacity-20">
              <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
              <p className="text-gray-300 mb-6">Please connect your wallet to participate in the lottery</p>
              <ConnectButton />
            </div>
          ) : (
            <>
              {activeTab === 'buy' && (
                <div className="space-y-6">
                  <TicketSelector
                    selectedNumbers={selectedNumbers}
                    setSelectedNumbers={setSelectedNumbers}
                    onAddTicket={handleAddTicket}
                  />

                  {tickets.length > 0 && (
                    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-6 border border-white border-opacity-20">
                      <h3 className="text-xl font-bold text-white mb-4">Your Tickets ({tickets.length})</h3>
                      <div className="space-y-3">
                        {tickets.map((ticket, index) => (
                          <div key={index} className="flex items-center justify-between bg-black bg-opacity-30 rounded-lg p-4">
                            <div className="flex space-x-2">
                              {ticket.map((num, i) => (
                                <div key={i} className="lottery-ball">
                                  {num}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => handleRemoveTicket(index)}
                              className="text-red-400 hover:text-red-300 font-semibold"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>

                      {tickets.length > 1 && (
                        <div className="mb-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-lg p-4">
                          <p className="text-yellow-400 font-semibold">
                            ⚠️ Note: Currently only the first ticket will be purchased. Multiple ticket purchases coming soon!
                          </p>
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-white">
                          <p className="text-sm text-gray-300">Cost per Ticket</p>
                          <p className="text-2xl font-bold">
                            {ticketPrice ? formatEther(ticketPrice) : '0'} ETH
                          </p>
                        </div>
                        <button
                          onClick={handleBuyTickets}
                          disabled={isConfirming}
                          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isConfirming ? 'Confirming...' : 'Buy Ticket'}
                        </button>
                      </div>

                      {isConfirmed && (
                        <div className="mt-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-lg p-4">
                          <p className="text-green-400 font-semibold">✅ Ticket purchased successfully!</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'myTickets' && (
                <MyTickets address={address} currentDraw={currentDraw} />
              )}

              {activeTab === 'history' && (
                <DrawHistory currentDraw={currentDraw} />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

