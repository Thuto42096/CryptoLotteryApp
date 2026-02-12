# 🎰 Crypto Lottery DApp

A decentralized lottery application built on Ethereum Sepolia testnet, powered by Chainlink VRF v2 for provably fair random number generation, Chainlink Automation for automated draws, and Chainlink Price Feeds for real-time prize pool valuation.

## 🌟 Features

- **Provably Fair**: Uses Chainlink VRF v2 for verifiable random number generation
- **Automated Draws**: Chainlink Keepers automatically trigger draws every 24 hours
- **Position-Based Matching**: Players must match both number AND position to win
- **Multiple Tickets**: Buy multiple tickets in a single transaction
- **Real-time Prize Pool**: View prize pool in ETH and USD using Chainlink Price Feeds
- **Draw History**: View past draws and winning numbers
- **My Tickets**: Track your tickets and winnings
- **Responsive UI**: Beautiful, modern interface built with Next.js and Tailwind CSS

## 🎮 How It Works

1. **Select Numbers**: Choose 7 numbers from 1-49 (or use Quick Pick)
2. **Buy Tickets**: Purchase tickets for 0.01 ETH each
3. **Wait for Draw**: Draws happen automatically every 24 hours
4. **Win Prizes**: Each correct number in the correct position = 5% of prize pool
   - 7 matches = 35% of prize pool
   - 6 matches = 30% of prize pool
   - 5 matches = 25% of prize pool
   - And so on...

## 🏗️ Architecture

### Smart Contract
- **Solidity 0.8.19**
- **Chainlink VRF v2**: Generates 7 random numbers (1-49)
- **Chainlink Automation**: Triggers draws when conditions are met
- **Chainlink Price Feeds**: ETH/USD price for prize pool display
- **10% Fee**: Platform takes 10% of ticket sales

### Frontend
- **Next.js 14**: React framework with server-side rendering
- **RainbowKit**: Beautiful wallet connection UI
- **Wagmi**: React hooks for Ethereum
- **Tailwind CSS**: Utility-first CSS framework

## 📋 Prerequisites

- Node.js 16+ and npm
- MetaMask or another Web3 wallet
- Sepolia testnet ETH (get from [Sepolia Faucet](https://sepoliafaucet.com/))
- Alchemy or Infura API key
- Etherscan API key (for contract verification)

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
# Install smart contract dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your values:
```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
VRF_SUBSCRIPTION_ID=your_vrf_subscription_id
```

### 3. Set Up Chainlink VRF Subscription

1. Go to [Chainlink VRF](https://vrf.chain.link/)
2. Connect your wallet to Sepolia testnet
3. Create a new subscription
4. Fund it with testnet LINK (get from [Chainlink Faucet](https://faucets.chain.link/))
5. Copy the subscription ID to your `.env` file

### 4. Deploy Smart Contract

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

After deployment:
1. Copy the contract address
2. Add the contract as a consumer to your VRF subscription
3. Register the contract with [Chainlink Automation](https://automation.chain.link/)

### 5. Configure Frontend

Create `frontend/.env.local`:
```
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 6. Run Frontend

```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000`

## 📝 Smart Contract Functions

### User Functions
- `buyTicket(uint8[7] numbers)`: Buy a single ticket
- `buyMultipleTickets(uint8[7][] ticketsNumbers)`: Buy multiple tickets
- `getCurrentDrawNumber()`: Get current draw number
- `getPrizePool()`: Get current prize pool in ETH
- `getPrizePoolInUSD()`: Get prize pool in USD
- `getTimeUntilDraw()`: Get seconds until next draw
- `getDraw(uint256 drawNumber)`: Get draw results
- `getTicketsByDrawForPlayer(address, uint256)`: Get player's tickets for a draw

### Admin Functions
- `withdrawFees()`: Owner can withdraw accumulated fees

## 🔐 Security Features

- Reentrancy protection
- Access control for admin functions
- Chainlink VRF for tamper-proof randomness
- Automated execution via Chainlink Keepers
- Immutable core parameters

## 🧪 Testing

```bash
npx hardhat test
```

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## ⚠️ Disclaimer

This is a testnet application for educational purposes. Do not use on mainnet without thorough auditing.

