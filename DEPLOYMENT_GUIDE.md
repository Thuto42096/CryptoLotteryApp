# 🚀 Deployment Guide

This guide will walk you through deploying the Crypto Lottery DApp to Sepolia testnet.

## Prerequisites Checklist

- [ ] Node.js 16+ installed
- [ ] MetaMask wallet with Sepolia ETH
- [ ] Alchemy or Infura account
- [ ] Etherscan account (for verification)
- [ ] Chainlink VRF subscription created and funded

## Step-by-Step Deployment

### 1. Get Testnet Resources

#### Sepolia ETH
- Visit [Sepolia Faucet](https://sepoliafaucet.com/)
- Or [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- Request 0.5 ETH (you'll need it for deployment and testing)

#### Sepolia LINK
- Visit [Chainlink Faucet](https://faucets.chain.link/)
- Connect wallet to Sepolia
- Request 20 LINK tokens

### 2. Set Up Alchemy

1. Go to [Alchemy](https://www.alchemy.com/)
2. Create a free account
3. Create a new app:
   - Chain: Ethereum
   - Network: Sepolia
4. Copy the HTTPS URL (looks like: `https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY`)

### 3. Get Etherscan API Key

1. Go to [Etherscan](https://etherscan.io/)
2. Create account and log in
3. Go to API Keys section
4. Create new API key
5. Copy the key

### 4. Create Chainlink VRF Subscription

1. Visit [Chainlink VRF](https://vrf.chain.link/)
2. Connect MetaMask to Sepolia
3. Click "Create Subscription"
4. Confirm transaction
5. Fund subscription with 10 LINK
6. Copy the Subscription ID

### 5. Configure Environment

Create `.env` file in project root:

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x
ETHERSCAN_API_KEY=your_etherscan_api_key
VRF_SUBSCRIPTION_ID=your_subscription_id
```

⚠️ **IMPORTANT**: Never commit your `.env` file to git!

### 6. Install Dependencies

```bash
# Root dependencies (Hardhat)
npm install

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 7. Compile Smart Contract

```bash
npx hardhat compile
```

You should see:
```
Compiled 1 Solidity file successfully
```

### 8. Deploy to Sepolia

```bash
npm run deploy
```

Expected output:
```
Deploying CryptoLottery contract to Sepolia...
✅ CryptoLottery deployed to: 0x...
```

**Save the contract address!**

### 9. Add Contract as VRF Consumer

1. Go back to [Chainlink VRF](https://vrf.chain.link/)
2. Click on your subscription
3. Click "Add Consumer"
4. Paste your contract address
5. Confirm transaction

### 10. Register with Chainlink Automation

1. Visit [Chainlink Automation](https://automation.chain.link/)
2. Connect wallet to Sepolia
3. Click "Register New Upkeep"
4. Select "Custom Logic"
5. Enter your contract address
6. Set upkeep name: "Crypto Lottery Draw"
7. Set gas limit: 500,000
8. Fund with 5 LINK
9. Confirm registration

### 11. Configure Frontend

Create `frontend/.env.local`:

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0xYOUR_CONTRACT_ADDRESS
NEXT_PUBLIC_CHAIN_ID=11155111
```

### 12. Update WalletConnect Project ID

1. Go to [WalletConnect Cloud](https://cloud.walletconnect.com/)
2. Create a new project
3. Copy the Project ID
4. Update `frontend/src/utils/wagmi.js`:
   ```javascript
   projectId: 'YOUR_WALLETCONNECT_PROJECT_ID'
   ```

### 13. Run Frontend Locally

```bash
npm run frontend
```

Visit `http://localhost:3000`

### 14. Test the Application

1. Connect your MetaMask wallet
2. Switch to Sepolia network
3. Select 7 numbers
4. Buy a ticket (0.01 ETH)
5. Wait for transaction confirmation
6. Check "My Tickets" tab

### 15. Verify Contract on Etherscan

If automatic verification failed during deployment:

```bash
npx hardhat verify --network sepolia YOUR_CONTRACT_ADDRESS \
  "0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625" \
  YOUR_SUBSCRIPTION_ID \
  "0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c" \
  500000 \
  "0x694AA1769357215DE4FAC081bf1f309aDC325306"
```

## Troubleshooting

### "Insufficient funds" error
- Make sure you have enough Sepolia ETH in your wallet
- Get more from faucets

### "VRF subscription not found"
- Double-check your subscription ID in `.env`
- Make sure subscription is funded with LINK

### "Upkeep not needed"
- Wait 24 hours after first ticket purchase
- Or manually trigger draw (for testing)

### Frontend not connecting
- Check MetaMask is on Sepolia network
- Verify contract address in `frontend/.env.local`
- Clear browser cache and reload

## Next Steps

1. **Buy tickets** and test the lottery
2. **Wait for draw** (24 hours or trigger manually for testing)
3. **Check results** in Draw History
4. **Share** with friends to test multiplayer

## Production Deployment

⚠️ **DO NOT deploy to mainnet without:**
- Professional security audit
- Comprehensive testing
- Legal compliance review
- Proper insurance/reserves

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review Hardhat/Chainlink documentation
3. Open an issue on GitHub

Happy lottery building! 🎰

