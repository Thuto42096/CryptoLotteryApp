// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

contract CryptoLottery is VRFConsumerBaseV2Plus {
  event RequestSent(uint256 requestId, uint32 numWords);
  event RequestFulfilled(uint256 requestId, uint256[] randomWords);
  event Entered(address indexed player, uint256[] numbers);
  event WinnersPaid(uint256 matchCount, uint256 winnerCount, uint256 totalPayout);
  event RoundEnded(uint256 roundId, uint256 rolledOverPot);

  struct RequestStatus {
    bool fulfilled; // whether the request has been successfully fulfilled
    bool exists; // whether a requestId exists
    uint256[] randomWords;
  }

  mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

  // Your subscription ID.
  uint256 public s_subscriptionId;

  // Past request IDs.
  uint256[] public requestIds;
  uint256 public lastRequestId;

  // Lottery State
  uint256 public constant TICKET_PRICE = 0.000000005 ether; // 5 Gwei for testing
  uint256 public constant ROUND_DURATION = 5 minutes;
  uint256 public roundEndTime;
  uint256 public prizePool;
  uint256 public ownerFees;
  uint256 public currentRoundId;
  
  mapping(address => uint256) public lastPlayedRound;

  // The gas lane to use, which specifies the maximum gas price to bump to.
  // For a list of available gas lanes on each network,
  // see https://docs.chain.link/vrf/v2-5/supported-networks
  bytes32 public keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

  // Depends on the number of requested values that you want sent to the
  // fulfillRandomWords() function. Storing each word costs about 20,000 gas,
  // so 100,000 is a safe default for this example contract. Test and adjust
  // this limit based on the network that you select, the size of the request,
  // and the processing of the callback request in the fulfillRandomWords()
  // function.
  uint32 public callbackGasLimit = 2_500_000;

  // The default is 3, but you can set this higher.
  uint16 public requestConfirmations = 3;

  // For this example, retrieve 7 random values in one request.
  // Cannot exceed VRFCoordinatorV2_5.MAX_NUM_WORDS.
  uint32 public numWords = 7;

  struct Ticket {
    address player;
    uint256 numbers; // Packed 7 numbers (1 byte each)
  }

  Ticket[] public tickets;

  /**
   * HARDCODED FOR SEPOLIA
   * COORDINATOR: 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B
   */
  constructor(
    uint256 subscriptionId
  ) VRFConsumerBaseV2Plus(0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B) {
    s_subscriptionId = subscriptionId;
  }

  function enter(uint256[] calldata numbers) external payable {
    require(msg.sender != owner(), "Owner cannot enter");
    require(msg.value == TICKET_PRICE, "Incorrect ETH amount");
    require(lastPlayedRound[msg.sender] != currentRoundId + 1, "Already joined this round");
    require(numbers.length == 7, "Must choose 7 numbers");
    
    uint256 packed;
    for(uint256 i = 0; i < 7; i++) {
        require(numbers[i] >= 1 && numbers[i] <= 49, "Number out of range (1-49)");
        packed |= numbers[i] << (i * 8);
    }

    // Start timer if first player
    if (tickets.length == 0) {
        roundEndTime = block.timestamp + ROUND_DURATION;
    } else {
        require(block.timestamp < roundEndTime, "Round ended, wait for draw");
    }

    // 10% to owner, 90% to prize pool
    uint256 fee = (msg.value * 10) / 100;
    ownerFees += fee;
    prizePool += (msg.value - fee);

    lastPlayedRound[msg.sender] = currentRoundId + 1; // Use +1 to distinguish from default 0
    tickets.push(Ticket({player: msg.sender, numbers: packed}));
    
    emit Entered(msg.sender, numbers);
  }

  function pickWinner() external returns (uint256 requestId) {
    require(tickets.length > 0, "No players in pool");
    require(block.timestamp >= roundEndTime, "Round not finished");

    // Will revert if subscription is not set and funded.
    requestId = s_vrfCoordinator.requestRandomWords(
      VRFV2PlusClient.RandomWordsRequest({
        keyHash: keyHash,
        subId: s_subscriptionId,
        requestConfirmations: requestConfirmations,
        callbackGasLimit: callbackGasLimit,
        numWords: numWords,
        extraArgs: VRFV2PlusClient._argsToBytes(VRFV2PlusClient.ExtraArgsV1({nativePayment: false}))
      })
    );
    s_requests[requestId] = RequestStatus({randomWords: new uint256[](0), exists: true, fulfilled: false});
    requestIds.push(requestId);
    lastRequestId = requestId;
    emit RequestSent(requestId, numWords);
    return requestId;
  }

  function fulfillRandomWords(
    uint256 _requestId,
    uint256[] calldata _randomWords
  ) internal override {
    require(s_requests[_requestId].exists, "request not found");
    s_requests[_requestId].fulfilled = true;

    // Generate winning numbers
    uint256[] memory lottoResult = new uint256[](7);
    for (uint256 i = 0; i < 7; i++) {
      lottoResult[i] = (_randomWords[i] % 49) + 1;
    }
    s_requests[_requestId].randomWords = lottoResult;
    emit RequestFulfilled(_requestId, lottoResult);

    // Distribute Rewards
    distributeRewards(lottoResult);

    // Reset for next round
    delete tickets;
    roundEndTime = 0;
    currentRoundId++;
    emit RoundEnded(currentRoundId, prizePool);
  }

  function distributeRewards(uint256[] memory winningNumbers) internal {
    uint256 currentPot = prizePool;
    // Percentages: 1->0%, 2->5%, 3->10%, 4->15%, 5->20%, 6->20%, 7->30%
    uint256[8] memory percentages = [uint256(0), 0, 5, 10, 15, 20, 20, 30];
    
    // Track winners per tier to split the share
    uint256[8] memory winnerCounts;
    uint8[] memory matchesPerTicket = new uint8[](tickets.length);
    
    // First pass: count winners for each tier
    for (uint256 i = 0; i < tickets.length; i++) {
        uint256 packed = tickets[i].numbers;
        uint256 matches = 0;
        for (uint256 j = 0; j < 7; j++) {
            if (((packed >> (j * 8)) & 0xFF) == winningNumbers[j]) {
                matches++;
            }
        }
        matchesPerTicket[i] = uint8(matches);
        if (matches > 0) {
            winnerCounts[matches]++;
        }
    }

    // Second pass: distribute
    // We iterate tickets again to pay out. 
    // Note: In production with many users, this loop pattern can hit gas limits. 
    // Consider Claim pattern for scalability.
    for (uint256 i = 0; i < tickets.length; i++) {
        uint256 matches = matchesPerTicket[i];

        if (matches >= 2) {
            // Calculate share for this tier
            uint256 tierShare = (currentPot * percentages[matches]) / 100;
            // Split among winners of this tier
            uint256 payout = tierShare / winnerCounts[matches];
            
            if (payout > 0) {
                prizePool -= payout;
                payable(tickets[i].player).transfer(payout);
                (bool success, ) = payable(tickets[i].player).call{value: payout}("");
                require(success, "Transfer failed");
            }
        }
    }
    // Any undistributed prizePool (due to no winners in a tier) remains for next round.
  }

  function getRequestStatus(
    uint256 _requestId
  ) external view returns (bool fulfilled, uint256[] memory randomWords) {
    require(s_requests[_requestId].exists, "request not found");
    RequestStatus memory request = s_requests[_requestId];
    return (request.fulfilled, request.randomWords);
  }

  function withdrawOwnerFees() external onlyOwner {
      uint256 amount = ownerFees;
      ownerFees = 0;
      (bool success, ) = payable(msg.sender).call{value: amount}("");
      require(success, "Transfer failed");
  }
}
