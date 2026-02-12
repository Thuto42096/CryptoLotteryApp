# 🎰 Crypto Lottery - Project Overview

## 📋 Project Summary

A fully decentralized lottery application where players select 7 numbers (1-49) and must match both the number AND position to win prizes. Built on Ethereum Sepolia testnet with Chainlink services for provably fair randomness, automated draws, and real-time prize pool valuation.

## 🎯 Key Features

### Lottery Mechanics
- **Number Range**: 1-49
- **Numbers per Ticket**: 7
- **Ticket Price**: 0.01 ETH
- **Draw Frequency**: Every 24 hours (automated)
- **Winning Criteria**: Match number AND position
- **Prize Distribution**: 5% of pool per correct position
- **Platform Fee**: 10% of ticket sales

### Smart Contract Features
- ✅ Chainlink VRF v2 for random number generation
- ✅ Chainlink Automation (Keepers) for automatic draws
- ✅ Chainlink Price Feeds for ETH/USD conversion
- ✅ Multiple ticket purchases in single transaction
- ✅ Automatic prize distribution
- ✅ Complete draw history
- ✅ Player ticket tracking

### Frontend Features
- ✅ Beautiful, responsive UI with Tailwind CSS
- ✅ RainbowKit wallet connection
- ✅ Real-time prize pool updates
- ✅ Countdown to next draw
- ✅ Quick Pick number generator
- ✅ Multiple ticket cart system
- ✅ My Tickets view with win/loss tracking
- ✅ Complete draw history browser
- ✅ Prize breakdown calculator

## 🏗️ Technical Architecture

### Smart Contract Stack
```
CryptoLottery.sol
├── VRFConsumerBaseV2 (Chainlink VRF)
├── AutomationCompatibleInterface (Chainlink Keepers)
└── AggregatorV3Interface (Chainlink Price Feeds)
```

**Key Components:**
- **VRF Integration**: Requests 7 random words, generates unique numbers 1-49
- **Automation**: Checks every block if 24 hours passed + tickets exist
- **Prize Distribution**: Automatic payouts based on position matches
- **State Management**: OPEN ↔ CALCULATING states

### Frontend Stack
```
Next.js 14
├── React 18
├── RainbowKit (Wallet UI)
├── Wagmi (Ethereum hooks)
├── Viem (Ethereum library)
└── Tailwind CSS
```

**Key Components:**
- `TicketSelector`: Number selection grid with validation
- `PrizePool`: Real-time ETH and USD display
- `MyTickets`: Player's tickets with match highlighting
- `DrawHistory`: Past draws with statistics

## 📁 Project Structure

```
CryptoLotteryApp/
├── contracts/
│   └── CryptoLottery.sol          # Main lottery contract
├── scripts/
│   └── deploy.js                   # Deployment script
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── _app.js            # App wrapper with providers
│   │   │   └── index.js           # Main lottery interface
│   │   ├── components/
│   │   │   ├── TicketSelector.js  # Number selection UI
│   │   │   ├── PrizePool.js       # Prize display
│   │   │   ├── MyTickets.js       # User tickets view
│   │   │   └── DrawHistory.js     # Past draws browser
│   │   ├── utils/
│   │   │   ├── contract.js        # Contract ABI & address
│   │   │   └── wagmi.js           # Web3 configuration
│   │   └── styles/
│   │       └── globals.css        # Global styles
│   └── public/
├── hardhat.config.js               # Hardhat configuration
├── package.json                    # Root dependencies
├── README.md                       # Main documentation
├── DEPLOYMENT_GUIDE.md            # Step-by-step deployment
├── QUICKSTART.md                  # Quick start guide
└── .env.example                   # Environment template
```

## 🔐 Security Considerations

### Smart Contract
- ✅ Reentrancy protection via Checks-Effects-Interactions pattern
- ✅ Access control on admin functions
- ✅ Immutable critical parameters
- ✅ Chainlink VRF for tamper-proof randomness
- ✅ No user funds held (immediate distribution)

### Frontend
- ✅ Client-side validation
- ✅ Transaction confirmation feedback
- ✅ Error handling and user feedback
- ✅ No private keys in code

## 💰 Economics

### Revenue Model
- **Ticket Sales**: 0.01 ETH per ticket
- **Platform Fee**: 10% of each ticket
- **Prize Pool**: 90% of ticket sales

### Prize Distribution
- **7 matches**: 35% of pool (7 × 5%)
- **6 matches**: 30% of pool (6 × 5%)
- **5 matches**: 25% of pool (5 × 5%)
- **4 matches**: 20% of pool (4 × 5%)
- **3 matches**: 15% of pool (3 × 5%)
- **2 matches**: 10% of pool (2 × 5%)
- **1 match**: 5% of pool (1 × 5%)

### Example Scenario
```
100 tickets sold = 1 ETH total
- Prize Pool: 0.9 ETH
- Platform Fee: 0.1 ETH

Winner with 7 matches: 0.315 ETH (35%)
Winner with 5 matches: 0.225 ETH (25%)
Winner with 3 matches: 0.135 ETH (15%)
```

## 🔄 User Flow

1. **Connect Wallet** → MetaMask/WalletConnect
2. **Select Numbers** → Manual or Quick Pick
3. **Add to Cart** → Multiple tickets supported
4. **Purchase** → Single transaction for all tickets
5. **Wait** → Automatic draw every 24 hours
6. **Win** → Automatic prize distribution
7. **History** → View past draws and tickets

## 🛠️ Development Workflow

### Local Development
```bash
# Terminal 1: Local blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Testnet Deployment
```bash
# Deploy to Sepolia
npm run deploy

# Verify on Etherscan
npx hardhat verify --network sepolia <address> <args>
```

## 📊 Gas Optimization

- **Batch Purchases**: Buy multiple tickets in one transaction
- **Efficient Storage**: Packed structs and arrays
- **Minimal Loops**: Optimized iteration patterns
- **View Functions**: Off-chain data reading

## 🚀 Future Enhancements

### Smart Contract
- [ ] Multiple draw frequencies (daily, weekly)
- [ ] Jackpot rollover mechanism
- [ ] Referral system
- [ ] NFT tickets
- [ ] Multi-chain deployment

### Frontend
- [ ] Mobile app (React Native)
- [ ] Social sharing
- [ ] Statistics dashboard
- [ ] Leaderboard
- [ ] Email notifications
- [ ] Dark/light theme toggle

## 📈 Metrics to Track

- Total tickets sold
- Total prize pool distributed
- Number of winners
- Average tickets per draw
- Platform revenue
- User retention rate

## 🧪 Testing Checklist

- [ ] Buy single ticket
- [ ] Buy multiple tickets
- [ ] Quick pick functionality
- [ ] Number validation (1-49, ascending)
- [ ] Draw automation (24h interval)
- [ ] Prize distribution
- [ ] View ticket history
- [ ] View draw history
- [ ] Prize pool USD conversion
- [ ] Wallet connection/disconnection

## 📞 Support & Resources

- **Chainlink VRF**: https://docs.chain.link/vrf/v2/introduction
- **Chainlink Automation**: https://docs.chain.link/chainlink-automation
- **Hardhat**: https://hardhat.org/docs
- **Next.js**: https://nextjs.org/docs
- **RainbowKit**: https://www.rainbowkit.com/docs

## ⚖️ Legal Disclaimer

This is a testnet demonstration project for educational purposes only. 

**DO NOT use on mainnet without:**
- Professional security audit
- Legal compliance review
- Gambling license (if required in your jurisdiction)
- Terms of service and privacy policy
- Responsible gambling measures

## 📄 License

MIT License - See LICENSE file for details

---

Built with ❤️ using Chainlink, Ethereum, and Next.js

