# LinkedIn Outreach CRM 🚀

A Progressive Web App (PWA) for organizing LinkedIn contacts, generating personalized outreach messages, and tracking communication lifecycle for job-search outreach.

## ✨ Features

### 🔍 **Smart Classification Engine**
- Automatically classifies LinkedIn profiles by relevance
- Identifies function (AP, AR, P2P, O2C, R2R, Finance, HR)
- Determines seniority level (Associate, Manager, HR)
- Assigns confidence scores (High, Medium, Low)
- Flags ambiguous cases for manual review

### 📱 **PWA & Desktop Installation**
- Install as standalone desktop app
- Works offline with service worker
- Local data storage (no servers required)
- Native desktop window experience

### 🛡️ **LinkedIn Safety Compliance**
- **NO automation** of LinkedIn actions
- **NO scraping** or data harvesting
- **Manual** message copying and sending
- **Safe URL opening** with `noopener,noreferrer`

### 📊 **CRM Functionality**
- Contact management with status tracking
- Message queue and approval workflow
- Follow-up reminders
- Dashboard with metrics
- Duplicate prevention

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ [Download](https://nodejs.org/)
- npm (comes with Node.js)

### Installation
```bash
# Clone the repository
git clone https://github.com/prerit-g/linkedin-crm.git
cd linkedin-crm

# Install dependencies
npm install

# Start development server
npm run dev
```

### Open in Browser
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
linkedin-crm/
├── src/                    # Source code
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── engine/           # Classification engine
│   ├── hooks/            # Custom React hooks
│   ├── store/            # Zustand state management
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Utility functions
├── public/               # Static assets
│   └── icons/           # PWA icons
├── .kiro/               # Kiro IDE configuration
└── dist/                # Build output (generated)
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run lint` - Check TypeScript errors

## 🔒 Security & Privacy

- **100% client-side** - No data leaves your browser
- **Local storage** - All data stored in browser
- **No external APIs** - No LinkedIn API calls
- **No tracking** - No analytics or telemetry

## 📱 PWA Installation

1. Open the app in Chrome/Edge
2. Click the install icon (📥) in address bar
3. Or use browser menu → "Install App"
4. App opens in standalone window without browser UI

## 🎯 Target Audience

Job seekers in accounting and finance operations targeting:
- Accounts Payable (AP)
- Accounts Receivable (AR)
- Procure-to-Pay (P2P)
- Order-to-Cash (O2C)
- Record-to-Report (R2R)
- Finance Operations
- HR/Recruiting roles

## 🤝 Contributing

This is a personal project built with strict LinkedIn safety rules. Contributions should maintain:
- No LinkedIn automation
- No external API dependencies
- Client-side only functionality
- PWA compatibility

## 📄 License

MIT License - See LICENSE file for details.

## 🙏 Acknowledgments

Built with:
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)

---

**⚠️ Important**: This tool is for **manual** LinkedIn outreach only. It does NOT automate LinkedIn interactions and complies with LinkedIn's Terms of Service.