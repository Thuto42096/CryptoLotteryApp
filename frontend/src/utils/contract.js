export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "";

export const CONTRACT_ABI = [
  "function buyTicket(uint8[7] memory numbers) external payable",
  "function buyMultipleTickets(uint8[7][] memory ticketsNumbers) external payable",
  "function getCurrentDrawNumber() external view returns (uint256)",
  "function getPrizePool() external view returns (uint256)",
  "function getPrizePoolInUSD() external view returns (uint256)",
  "function getTicketPrice() external pure returns (uint256)",
  "function getDrawInterval() external pure returns (uint256)",
  "function getLotteryState() external view returns (uint8)",
  "function getTimeUntilDraw() external view returns (uint256)",
  "function getDraw(uint256 drawNumber) external view returns (tuple(uint8[7] winningNumbers, uint256 timestamp, uint256 prizePool, uint256 totalTickets))",
  "function getTicketsForDraw(uint256 drawNumber) external view returns (tuple(address player, uint8[7] numbers, uint256 drawNumber, uint256 timestamp)[])",
  "function getPlayerTickets(address player) external view returns (uint256[])",
  "function getTicketsByDrawForPlayer(address player, uint256 drawNumber) external view returns (tuple(address player, uint8[7] numbers, uint256 drawNumber, uint256 timestamp)[])",
  "event TicketPurchased(address indexed player, uint256 indexed drawNumber, uint256 ticketId, uint8[7] numbers)",
  "event DrawCompleted(uint256 indexed drawNumber, uint8[7] winningNumbers)",
  "event PrizeWon(address indexed player, uint256 indexed drawNumber, uint256 ticketId, uint256 prize, uint8 matches)"
];

