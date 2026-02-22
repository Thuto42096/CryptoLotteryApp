export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0xc5F6a4d91e76beFa16c09e5D0435411a02DF58A4";

export const CONTRACT_ABI = [
  "function enter(uint256[] calldata numbers) external payable",
  "function pickWinner() external returns (uint256 requestId)",
  "function withdrawOwnerFees() external",
  "function getRequestStatus(uint256 _requestId) external view returns (bool fulfilled, uint256[] memory randomWords)",
  "function owner() external view returns (address)",
  "function TICKET_PRICE() external view returns (uint256)",
  "function ROUND_DURATION() external view returns (uint256)",
  "function roundEndTime() external view returns (uint256)",
  "function prizePool() external view returns (uint256)",
  "function ownerFees() external view returns (uint256)",
  "function currentRoundId() external view returns (uint256)",
  "function lastPlayedRound(address) external view returns (uint256)",
  "function lastRequestId() external view returns (uint256)",
  "function requestIds(uint256) external view returns (uint256)",
  "function tickets(uint256) external view returns (address player, uint256 numbers)",
  "function s_subscriptionId() external view returns (uint256)",
  "event Entered(address indexed player, uint256[] numbers)",
  "event RequestSent(uint256 requestId, uint32 numWords)",
  "event RequestFulfilled(uint256 requestId, uint256[] randomWords)",
  "event WinnersPaid(uint256 matchCount, uint256 winnerCount, uint256 totalPayout)",
  "event RoundEnded(uint256 roundId, uint256 rolledOverPot)"
];

