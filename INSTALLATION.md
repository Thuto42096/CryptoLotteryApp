# 📦 Installation Instructions

## System Requirements

- **Node.js**: v16.x or higher
- **npm**: v8.x or higher (comes with Node.js)
- **Git**: Latest version
- **MetaMask**: Browser extension

## Step 1: Clone Repository

```bash
git clone https://github.com/Thuto42096/CryptoLotteryApp.git
cd CryptoLotteryApp
```

## Step 2: Install Smart Contract Dependencies

The project uses Hardhat for smart contract development. Due to npm cache permission issues, you may need to fix permissions first:

### Option A: Fix npm Permissions (Recommended)

```bash
# On macOS/Linux
sudo chown -R $(whoami) ~/.npm

# Then install
npm install
```

### Option B: Use Yarn Instead

```bash
# Install Yarn globally
npm install -g yarn

# Install dependencies
yarn install
```

### Option C: Use npx

```bash
# Install without global npm cache
npx hardhat
```

### Required Dependencies

The following will be installed:
- `hardhat` - Ethereum development environment
- `@nomicfoundation/hardhat-toolbox` - Hardhat plugins bundle
- `@chainlink/contracts` - Chainlink smart contracts
- `dotenv` - Environment variable management

## Step 3: Install Frontend Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### Required Frontend Dependencies

- `next` - React framework
- `react` & `react-dom` - React library
- `ethers` - Ethereum library
- `wagmi` - React hooks for Ethereum
- `@rainbow-me/rainbowkit` - Wallet connection UI
- `@tanstack/react-query` - Data fetching
- `viem` - TypeScript Ethereum library
- `tailwindcss` - CSS framework

## Step 4: Verify Installation

### Check Hardhat

```bash
# From project root
npx hardhat --version
```

Expected output: `2.x.x` or higher

### Check Frontend

```bash
cd frontend
npm run dev
```

Should start development server (may show errors about missing contract - that's normal)

## Common Installation Issues

### Issue: "EACCES: permission denied"

**Solution:**
```bash
sudo chown -R $(whoami) ~/.npm
npm cache clean --force
npm install
```

### Issue: "Module not found: @chainlink/contracts"

**Solution:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: "Python not found" (on Windows)

**Solution:**
```bash
npm install --global windows-build-tools
```

### Issue: "gyp ERR! build error"

**Solution:**
```bash
# On macOS
xcode-select --install

# On Ubuntu/Debian
sudo apt-get install build-essential

# On Windows
npm install --global windows-build-tools
```

### Issue: Frontend won't start

**Solution:**
```bash
cd frontend
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## Verify Smart Contract Compilation

```bash
npx hardhat compile
```

Expected output:
```
Compiled 1 Solidity file successfully
```

## Directory Structure After Installation

```
CryptoLotteryApp/
├── node_modules/          # Backend dependencies
├── contracts/             # Smart contracts
├── scripts/              # Deployment scripts
├── test/                 # Contract tests
├── frontend/
│   ├── node_modules/     # Frontend dependencies
│   ├── src/              # Source code
│   └── public/           # Static files
├── hardhat.config.js
└── package.json
```

## Next Steps

After successful installation:

1. **For Local Development**: See [QUICKSTART.md](./QUICKSTART.md)
2. **For Testnet Deployment**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
3. **For Project Overview**: See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

## Getting Help

If you encounter issues not covered here:

1. Check [GitHub Issues](https://github.com/Thuto42096/CryptoLotteryApp/issues)
2. Review [Hardhat Documentation](https://hardhat.org/docs)
3. Check [Next.js Documentation](https://nextjs.org/docs)

## Clean Installation

If all else fails, start fresh:

```bash
# Remove all dependencies and caches
rm -rf node_modules frontend/node_modules
rm -rf package-lock.json frontend/package-lock.json
rm -rf .next frontend/.next
rm -rf cache artifacts

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
cd frontend && npm install
```

## Updating Dependencies

To update to latest versions:

```bash
# Update root dependencies
npm update

# Update frontend dependencies
cd frontend
npm update
```

---

✅ Installation complete! Ready to build your lottery DApp!

