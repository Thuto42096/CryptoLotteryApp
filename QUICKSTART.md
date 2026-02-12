# ⚡ Quick Start Guide

Get the Crypto Lottery DApp running in 5 minutes!

## 🎯 For Developers (Local Testing)

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies  
cd frontend && npm install && cd ..
```

### 2. Start Local Hardhat Node

```bash
npx hardhat node
```

Keep this terminal open. You'll see 20 test accounts with ETH.

### 3. Deploy to Local Network (New Terminal)

```bash
# Copy first private key from hardhat node output
# Create .env file
echo "PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80" > .env
echo "SEPOLIA_RPC_URL=http://127.0.0.1:8545" >> .env
echo "VRF_SUBSCRIPTION_ID=1" >> .env

# Deploy
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Configure Frontend

```bash
# Copy the deployed contract address from step 3
echo "NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS" > frontend/.env.local
echo "NEXT_PUBLIC_CHAIN_ID=31337" >> frontend/.env.local
```

### 5. Run Frontend

```bash
npm run frontend
```

Visit `http://localhost:3000`

### 6. Connect MetaMask to Local Network

1. Open MetaMask
2. Add Network:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency: ETH
3. Import one of the test accounts using private key from step 2

---

## 🌐 For Sepolia Testnet

### Prerequisites
- MetaMask installed
- Sepolia ETH ([Get from faucet](https://sepoliafaucet.com/))
- Sepolia LINK ([Get from faucet](https://faucets.chain.link/))

### 1. Get API Keys

- **Alchemy**: [alchemy.com](https://www.alchemy.com/) - Create Sepolia app
- **Etherscan**: [etherscan.io](https://etherscan.io/) - Get API key
- **Chainlink VRF**: [vrf.chain.link](https://vrf.chain.link/) - Create subscription

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Install & Deploy

```bash
npm install
cd frontend && npm install && cd ..
npm run deploy
```

### 4. Setup Chainlink

1. Add contract as VRF consumer at [vrf.chain.link](https://vrf.chain.link/)
2. Register upkeep at [automation.chain.link](https://automation.chain.link/)

### 5. Run Frontend

```bash
# Add contract address to frontend/.env.local
npm run frontend
```

---

## 🎮 How to Play

1. **Connect Wallet** - Click "Connect Wallet" button
2. **Select Numbers** - Choose 7 numbers (1-49) or use Quick Pick
3. **Add Ticket** - Click "Add Ticket" to add to cart
4. **Buy Tickets** - Click "Buy Tickets" and confirm transaction
5. **Wait for Draw** - Draws happen every 24 hours automatically
6. **Check Results** - View "My Tickets" or "Draw History"

## 💡 Tips

- **Quick Pick**: Randomly generates 7 numbers
- **Multiple Tickets**: Add multiple tickets before buying to save gas
- **Position Matters**: Numbers must match exact position to win
- **Prize Calculation**: Each correct position = 5% of prize pool

## 🔧 Useful Commands

```bash
# Compile contracts
npm run compile

# Run tests
npm test

# Deploy to Sepolia
npm run deploy

# Run frontend
npm run frontend

# Build frontend for production
npm run frontend:build
```

## 📚 Learn More

- [Full README](./README.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Chainlink VRF Docs](https://docs.chain.link/vrf/v2/introduction)
- [Chainlink Automation Docs](https://docs.chain.link/chainlink-automation/introduction)

## ❓ Common Issues

**"Insufficient funds"**
- Get testnet ETH from faucets

**"Contract not deployed"**
- Check contract address in frontend/.env.local

**"Wrong network"**
- Switch MetaMask to Sepolia (Chain ID: 11155111)

**"Transaction failed"**
- Make sure you have enough ETH for gas + ticket price

---

Need help? Check the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions!

