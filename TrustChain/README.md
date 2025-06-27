# TrustChain - Decentralized Academic Credential Verifier

� **Vibathon: Web3 x AI Edition - Hackathon Project**
TrustChain is a comprehensive decentralized application built on the Internet Computer (IC) blockchain that enables secure issuance, storage, and verification of academic credentials. The system eliminates the need for forged diplomas and simplifies the verification process through blockchain technology.

## 🏗️ Architecture
- **Backend**: Motoko smart contracts on Internet Computer
- **Frontend**: React with TypeScript and Material-UI
- **Blockchain**: Internet Computer Protocol (ICP)
- **Authentication**: Internet Identity integration
- **QR Code**: Generation and scanning support
- **NFT**: Badge minting capabilities

## ✨ Key Features

### 🏛️ Institution Features
- **Single Credential Issuance**: Issue individual credentials with metadata
- **Bulk CSV Upload**: Upload and process multiple credentials at once
- **QR Code Generation**: Create QR codes for easy credential sharing
- **NFT Badge Minting**: Create blockchain-based achievement badges
- **Authentication**: Secure login with Internet Identity

### 🎓 Student Features
- **Credential Management**: View and organize personal credentials
- **QR Code Generation**: Create shareable QR codes for credentials
- **Secure Storage**: Credentials stored on blockchain for immutability
- **Export Options**: Download and share credential information

### 🔍 Verification Features
- **Manual Verification**: Enter credential IDs for instant verification
- **QR Code Scanning**: Scan QR codes using device camera
- **Real-time Results**: Instant verification with detailed credential information
- **Public Access**: No login required for verification

### 🔐 Security Features
- **Blockchain Security**: Tamper-proof storage on Internet Computer
- **Principal-based Authentication**: Secure user identification
- **Cryptographic Verification**: Hash-based credential integrity
- **Duplicate Prevention**: Built-in protection against duplicate credentials

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- DFX SDK (Internet Computer development environment)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TrustChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start local Internet Computer network**
   ```bash
   dfx start --background --clean
   ```

4. **Deploy the backend canister**
   ```bash
   dfx deploy trustchain_backend
   ```

5. **Build and deploy frontend**
   ```bash
   npm run build
   dfx deploy trustchain_frontend
   ```

6. **Start development server**
   ```bash
   npm run dev
   ```

### 🎬 Demo Mode

For a complete demonstration, run the automated demo script:

**Linux/Mac:**
```bash
chmod +x demo.sh
./demo.sh
```

**Windows:**
```cmd
demo.bat
```

## 📱 Usage Guide

### 🏛️ Institution Workflow

1. **Login**: Connect with Internet Identity
2. **Choose Action**:
   - **Single Credential**: Use "Issue Credential" tab
   - **Bulk Upload**: Use "Bulk Upload" tab with CSV
   - **QR Generation**: Use "QR Generator" tab
   - **NFT Badges**: Use "NFT Badges" tab

3. **Issue Credential**:
   ```
   Owner Principal: rdmx6-jaaaa-aaaah-qacaa-cai
   Metadata: {"degree": "Bachelor of Computer Science", "institution": "MIT", "gpa": "3.8"}
   ```

### 📊 CSV Upload Format

Create a CSV file with the following columns:
```csv
ownerPrincipal,recipientName,institution,credentialType,title,metadata
rdmx6-jaaaa-aaaah-qacaa-cai,John Doe,MIT,certificate,Computer Science Certificate,"{""gpa"": ""3.8"", ""year"": ""2024""}"
rdmx6-jaaaa-aaaah-qacaa-cai,Jane Smith,Stanford,badge,Blockchain Certification,"{""skills"": [""Smart Contracts"", ""DeFi""]}"
```

### 🎓 Student Workflow

1. **Login**: Connect with Internet Identity
2. **View Credentials**: Browse personal credential collection
3. **Generate QR**: Create QR codes for sharing
4. **Export**: Download credential information

### 🔍 Verification Workflow

1. **Choose Method**:
   - **Manual**: Enter credential ID directly
   - **QR Scanner**: Use camera to scan QR code
2. **View Results**: See verification status and credential details

## 🔧 Development

### Project Structure
```
TrustChain/
├── src/
│   ├── trustchain_backend/
│   │   └── main.mo                 # Motoko backend
│   ├── components/
│   │   ├── HomePage.tsx            # Landing page
│   │   ├── InstitutionDashboard.tsx # Institution interface
│   │   ├── StudentDashboard.tsx    # Student interface
│   │   ├── VerifyCredential.tsx    # Verification interface
│   │   ├── IssueCredentialForm.tsx # Single credential form
│   │   ├── CSVUploadProcessor.tsx  # Bulk upload handler
│   │   ├── CredentialQRGenerator.tsx # QR code generator
│   │   ├── VerifyCredentialScanner.tsx # QR scanner
│   │   ├── NFTBadgeMinter.tsx      # NFT badge creator
│   │   └── index.ts                # Component exports
│   ├── services/
│   │   └── trustChainService.ts    # Backend interaction
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   └── utils/
│       └── mockData.ts             # Development mock data
├── public/
│   └── index.html                  # HTML template
├── package.json                    # Dependencies
├── dfx.json                        # DFX configuration
├── tsconfig.json                   # TypeScript configuration
├── webpack.config.js               # Build configuration
├── demo.sh                         # Linux/Mac demo script
├── demo.bat                        # Windows demo script
└── README.md                       # This file
```

### Backend API

The Motoko backend provides the following functions:

```motoko
// Issue a new credential
issueCredential(owner: Principal, metadata: Text) : async Result.Result<Text, Text>

// Verify a credential by ID
verifyCredential(id: Text) : async ?Text

// Get all credentials (admin)
getAllCredentials() : async [Credential]

// Get credential count
getCredentialCount() : async Nat

// System information
getSystemInfo() : async Text
```

### Testing Commands

```bash
# Get all credentials
dfx canister call trustchain_backend getAllCredentials

# Issue a test credential
dfx canister call trustchain_backend issueCredential '(principal "rdmx6-jaaaa-aaaah-qacaa-cai", "{\"degree\": \"Test Degree\"}")'

# Verify a credential
dfx canister call trustchain_backend verifyCredential '"credential_id_here"'

# Get system info
dfx canister call trustchain_backend getSystemInfo
```

## 📸 Screenshots

### Institution Dashboard
- Multi-tab interface for different functions
- Single credential issuance form
- Bulk CSV upload with progress tracking
- QR code generation
- NFT badge minting

### Student Dashboard
- Personal credential collection
- Interactive credential details
- QR code generation for sharing
- Export and download options

### Verification Interface
- Manual credential ID entry
- QR code scanning with camera
- Real-time verification results
- Detailed credential information display

## 🔒 Security Considerations

- **Authentication**: Internet Identity provides secure, decentralized authentication
- **Principal Validation**: All inputs validated before blockchain calls
- **Duplicate Prevention**: System prevents duplicate credential issuance
- **Cryptographic Hashing**: Credential verification uses cryptographic methods
- **Immutable Storage**: Blockchain ensures credential data cannot be tampered with

## 🌐 Deployment

### Local Development
```bash
dfx start --background
dfx deploy
npm run dev
```

### Production Deployment
```bash
dfx deploy --network ic
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Links

- [Internet Computer](https://internetcomputer.org/)
- [Motoko Programming Language](https://sdk.dfinity.org/docs/language-guide/motoko.html)
- [React Documentation](https://reactjs.org/)
- [Material-UI](https://mui.com/)

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Check the documentation
- Join the Internet Computer developer community

---

**TrustChain** - Securing academic credentials with blockchain technology 🎓⛓️
