# 🚀 GitHub Profile Analyser

A premium, interactive web analytics platform designed with a sleek dark/light glassmorphic UI. It connects directly to the GitHub REST API to visualizes programmer profiles, language summaries, contribution calendars, active commit streaks, and repository health metrics, with custom tools to download a cyber-style Developer Card or generate profile templates.

🌐 **Live URL**: [github-profile-analyser-six.vercel.app](https://github-profile-analyser-six.vercel.app/)

---

## ✨ Features

*   **🌓 Dynamic Theme Toggle**: Instantly transitions between a cyber-dark theme and a clean slate-light theme. Persistent across sessions via `localStorage`.
*   **🔑 GitHub Personal Access Token (Settings Drawer)**: A secure drawer that allows saving a GitHub token locally in the browser to raise API rate limits from 60 to 5,000 requests/hour.
*   **🔗 Social Sharing & Sharing URLs**: Native Web Share API integration with social fallbacks (Twitter, LinkedIn, WhatsApp). Automatically parses `?user=username` query params on load.
*   **🏆 Developer Achievements**: Gamified metrics calculating commit streaks, follower count, total stars, and repository health score to unlock unique programmer badges.
*   **📄 Profile README.md Generator**: Custom template builder generating markdown configurations for GitHub profile repositories with language bars and health summaries.
*   **⌨️ Keyboard Shortcuts legend**: Hotkey integrations (`t` to toggle themes, `/` to focus search, `s` for settings, `?` for legend overlay, and `Esc` to close draw inputs).
*   **📊 D3.js Language breakdowns**: Responsive SVG charts representing user's primary languages and repository sizes.
*   **📅 Contribution Graph**: A custom 90-day activity heatmap tracking events and push frequency with details on hover.
*   **🛡️ Repository Health Scoring**: System analyzing star weights, completeness of description/homepages, issue ratios, update recency, and repo size.
*   **💳 Developer Card PNG Export**: High-fidelity, shareable digital ID card downloadable with one click.

---

## 🛠️ Technology Stack

*   **Frontend**: React (Vite SPA)
*   **Visualizations**: D3.js (Data-Driven Documents)
*   **Styling**: Vanilla CSS (Custom properties / variables, Glassmorphism, CSS Grid, animations)
*   **Integrations**: HTML-to-Image & File-Saver (for PNG exporting), GitHub REST API

---

## ⚙️ Local Development Setup

To run this application locally, ensure you have [Node.js](https://nodejs.org) installed, then execute:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/jabbarSoomro/GitHub-Profile-Analyser.git
    cd GitHub-Profile-Analyser
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```

4.  **Build for Production**:
    ```bash
    npm run build
    ```

---

## 👤 Author

*   **Jabbar Ali Soomro**
    *   GitHub: [@jabbarSoomro](https://github.com/jabbarSoomro)
    *   Portfolio: [jabbarali.vercel.app](https://jabbarali.vercel.app/)
    *   LinkedIn: [Jabbar Ali Soomro](https://www.linkedin.com/in/jabbar-ali-soomro/)

---

*Built with ❤️ to highlight developer profiles.*
