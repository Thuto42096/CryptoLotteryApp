// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/automation/AutomationCompatible.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract CryptoLottery is VRFConsumerBaseV2, AutomationCompatibleInterface {
    // Chainlink VRF Variables
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 7;

    // Chainlink Price Feed
    AggregatorV3Interface private immutable i_priceFeed;

    // Lottery Variables
    uint256 private constant TICKET_PRICE = 0.01 ether;
    uint256 private constant DRAW_INTERVAL = 1 days;
    uint256 private constant FEE_PERCENTAGE = 10;
    uint256 private constant PRIZE_PER_MATCH = 5; // 5% per correct position
    
    address private immutable i_owner;
    uint256 private s_lastDrawTimestamp;
    uint256 private s_drawNumber;
    uint256 private s_prizePool;
    uint256 private s_accumulatedFees;
    
    enum LotteryState {
        OPEN,
        CALCULATING
    }
    LotteryState private s_lotteryState;

    struct Ticket {
        address player;
        uint8[7] numbers;
        uint256 drawNumber;
        uint256 timestamp;
    }

    struct Draw {
        uint8[7] winningNumbers;
        uint256 timestamp;
        uint256 prizePool;
        uint256 totalTickets;
    }

    mapping(uint256 => Ticket[]) private s_ticketsByDraw;
    mapping(uint256 => Draw) private s_draws;
    mapping(address => uint256[]) private s_playerTicketIds;
    mapping(uint256 => mapping(uint256 => uint256)) private s_ticketIdByDrawAndIndex;
    
    uint256 private s_totalTickets;

    // Events
    event TicketPurchased(address indexed player, uint256 indexed drawNumber, uint256 ticketId, uint8[7] numbers);
    event DrawRequested(uint256 indexed drawNumber, uint256 requestId);
    event DrawCompleted(uint256 indexed drawNumber, uint8[7] winningNumbers);
    event PrizeWon(address indexed player, uint256 indexed drawNumber, uint256 ticketId, uint256 prize, uint8 matches);
    event FeesWithdrawn(address indexed owner, uint256 amount);

    constructor(
        address vrfCoordinatorV2,
        uint64 subscriptionId,
        bytes32 gasLane,
        uint32 callbackGasLimit,
        address priceFeed
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_gasLane = gasLane;
        i_callbackGasLimit = callbackGasLimit;
        i_priceFeed = AggregatorV3Interface(priceFeed);
        i_owner = msg.sender;
        s_lastDrawTimestamp = block.timestamp;
        s_lotteryState = LotteryState.OPEN;
        s_drawNumber = 1;
    }

    function buyTicket(uint8[7] memory numbers) external payable {
        require(s_lotteryState == LotteryState.OPEN, "Lottery is not open");
        require(msg.value == TICKET_PRICE, "Incorrect ticket price");
        require(isValidTicket(numbers), "Invalid ticket numbers");

        uint256 ticketId = s_totalTickets;
        s_totalTickets++;

        Ticket memory newTicket = Ticket({
            player: msg.sender,
            numbers: numbers,
            drawNumber: s_drawNumber,
            timestamp: block.timestamp
        });

        s_ticketsByDraw[s_drawNumber].push(newTicket);
        s_playerTicketIds[msg.sender].push(ticketId);
        s_ticketIdByDrawAndIndex[s_drawNumber][s_ticketsByDraw[s_drawNumber].length - 1] = ticketId;

        // Add to prize pool (90% of ticket price, 10% fee)
        uint256 fee = (msg.value * FEE_PERCENTAGE) / 100;
        s_accumulatedFees += fee;
        s_prizePool += msg.value - fee;

        emit TicketPurchased(msg.sender, s_drawNumber, ticketId, numbers);
    }

    function buyMultipleTickets(uint8[7][] memory ticketsNumbers) external payable {
        require(s_lotteryState == LotteryState.OPEN, "Lottery is not open");
        require(msg.value == TICKET_PRICE * ticketsNumbers.length, "Incorrect total price");

        for (uint256 i = 0; i < ticketsNumbers.length; i++) {
            require(isValidTicket(ticketsNumbers[i]), "Invalid ticket numbers");
            
            uint256 ticketId = s_totalTickets;
            s_totalTickets++;

            Ticket memory newTicket = Ticket({
                player: msg.sender,
                numbers: ticketsNumbers[i],
                drawNumber: s_drawNumber,
                timestamp: block.timestamp
            });

            s_ticketsByDraw[s_drawNumber].push(newTicket);
            s_playerTicketIds[msg.sender].push(ticketId);
            s_ticketIdByDrawAndIndex[s_drawNumber][s_ticketsByDraw[s_drawNumber].length - 1] = ticketId;

            emit TicketPurchased(msg.sender, s_drawNumber, ticketId, ticketsNumbers[i]);
        }

        uint256 totalFee = (msg.value * FEE_PERCENTAGE) / 100;
        s_accumulatedFees += totalFee;
        s_prizePool += msg.value - totalFee;
    }

    function isValidTicket(uint8[7] memory numbers) private pure returns (bool) {
        // Check if numbers are in range 1-49 and in ascending order
        for (uint256 i = 0; i < 7; i++) {
            if (numbers[i] < 1 || numbers[i] > 49) {
                return false;
            }
            if (i > 0 && numbers[i] <= numbers[i - 1]) {
                return false;
            }
        }
        return true;
    }

    // Chainlink Automation - Check if upkeep is needed
    function checkUpkeep(bytes memory /* checkData */)
        public
        view
        override
        returns (bool upkeepNeeded, bytes memory /* performData */)
    {
        bool timePassed = (block.timestamp - s_lastDrawTimestamp) >= DRAW_INTERVAL;
        bool isOpen = s_lotteryState == LotteryState.OPEN;
        bool hasTickets = s_ticketsByDraw[s_drawNumber].length > 0;
        upkeepNeeded = timePassed && isOpen && hasTickets;
        return (upkeepNeeded, "0x0");
    }

    // Chainlink Automation - Perform upkeep
    function performUpkeep(bytes calldata /* performData */) external override {
        (bool upkeepNeeded, ) = checkUpkeep("");
        require(upkeepNeeded, "Upkeep not needed");

        s_lotteryState = LotteryState.CALCULATING;

        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        emit DrawRequested(s_drawNumber, requestId);
    }

    // Chainlink VRF Callback
    function fulfillRandomWords(uint256 /* requestId */, uint256[] memory randomWords)
        internal
        override
    {
        uint8[7] memory winningNumbers = generateWinningNumbers(randomWords);

        s_draws[s_drawNumber] = Draw({
            winningNumbers: winningNumbers,
            timestamp: block.timestamp,
            prizePool: s_prizePool,
            totalTickets: s_ticketsByDraw[s_drawNumber].length
        });

        emit DrawCompleted(s_drawNumber, winningNumbers);

        // Process winners and distribute prizes
        distributeWinnings(s_drawNumber, winningNumbers);

        // Reset for next draw
        s_drawNumber++;
        s_lastDrawTimestamp = block.timestamp;
        s_prizePool = 0;
        s_lotteryState = LotteryState.OPEN;
    }

    function generateWinningNumbers(uint256[] memory randomWords)
        private
        pure
        returns (uint8[7] memory)
    {
        uint8[7] memory numbers;
        bool[50] memory used; // Track used numbers (index 0 unused, 1-49 used)

        for (uint256 i = 0; i < 7; i++) {
            uint8 number;
            do {
                number = uint8((randomWords[i] % 49) + 1);
            } while (used[number]);

            used[number] = true;
            numbers[i] = number;
        }

        // Sort numbers in ascending order
        sortNumbers(numbers);
        return numbers;
    }

    function sortNumbers(uint8[7] memory numbers) private pure {
        for (uint256 i = 0; i < 7; i++) {
            for (uint256 j = i + 1; j < 7; j++) {
                if (numbers[i] > numbers[j]) {
                    uint8 temp = numbers[i];
                    numbers[i] = numbers[j];
                    numbers[j] = temp;
                }
            }
        }
    }

    function distributeWinnings(uint256 drawNumber, uint8[7] memory winningNumbers) private {
        Ticket[] memory tickets = s_ticketsByDraw[drawNumber];
        uint256 drawPrizePool = s_draws[drawNumber].prizePool;

        for (uint256 i = 0; i < tickets.length; i++) {
            uint8 matches = countMatches(tickets[i].numbers, winningNumbers);

            if (matches > 0) {
                uint256 prize = (drawPrizePool * PRIZE_PER_MATCH * matches) / 100;

                if (prize > 0) {
                    (bool success, ) = payable(tickets[i].player).call{value: prize}("");
                    if (success) {
                        uint256 ticketId = s_ticketIdByDrawAndIndex[drawNumber][i];
                        emit PrizeWon(tickets[i].player, drawNumber, ticketId, prize, matches);
                    }
                }
            }
        }
    }

    function countMatches(uint8[7] memory ticketNumbers, uint8[7] memory winningNumbers)
        private
        pure
        returns (uint8)
    {
        uint8 matches = 0;
        for (uint256 i = 0; i < 7; i++) {
            if (ticketNumbers[i] == winningNumbers[i]) {
                matches++;
            }
        }
        return matches;
    }

    // View functions
    function getCurrentDrawNumber() external view returns (uint256) {
        return s_drawNumber;
    }

    function getPrizePool() external view returns (uint256) {
        return s_prizePool;
    }

    function getPrizePoolInUSD() external view returns (uint256) {
        (, int256 price, , , ) = i_priceFeed.latestRoundData();
        uint256 ethPriceInUSD = uint256(price) * 1e10; // Price feed returns 8 decimals
        return (s_prizePool * ethPriceInUSD) / 1e18;
    }

    function getTicketPrice() external pure returns (uint256) {
        return TICKET_PRICE;
    }

    function getDrawInterval() external pure returns (uint256) {
        return DRAW_INTERVAL;
    }

    function getLotteryState() external view returns (LotteryState) {
        return s_lotteryState;
    }

    function getTimeUntilDraw() external view returns (uint256) {
        uint256 timePassed = block.timestamp - s_lastDrawTimestamp;
        if (timePassed >= DRAW_INTERVAL) {
            return 0;
        }
        return DRAW_INTERVAL - timePassed;
    }

    function getDraw(uint256 drawNumber) external view returns (Draw memory) {
        return s_draws[drawNumber];
    }

    function getTicketsForDraw(uint256 drawNumber) external view returns (Ticket[] memory) {
        return s_ticketsByDraw[drawNumber];
    }

    function getPlayerTickets(address player) external view returns (uint256[] memory) {
        return s_playerTicketIds[player];
    }

    function getTicketsByDrawForPlayer(address player, uint256 drawNumber)
        external
        view
        returns (Ticket[] memory)
    {
        Ticket[] memory allTickets = s_ticketsByDraw[drawNumber];
        uint256 count = 0;

        for (uint256 i = 0; i < allTickets.length; i++) {
            if (allTickets[i].player == player) {
                count++;
            }
        }

        Ticket[] memory playerTickets = new Ticket[](count);
        uint256 index = 0;

        for (uint256 i = 0; i < allTickets.length; i++) {
            if (allTickets[i].player == player) {
                playerTickets[index] = allTickets[i];
                index++;
            }
        }

        return playerTickets;
    }

    function withdrawFees() external {
        require(msg.sender == i_owner, "Only owner can withdraw fees");
        uint256 amount = s_accumulatedFees;
        s_accumulatedFees = 0;

        (bool success, ) = payable(i_owner).call{value: amount}("");
        require(success, "Transfer failed");

        emit FeesWithdrawn(i_owner, amount);
    }

    receive() external payable {}
}
