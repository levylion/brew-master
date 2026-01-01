# BrewMaster - Chrome DevTools MCP Demo Application

**BrewMaster** is a premium-themed Angular application designed to demonstrate the capabilities of the Chrome DevTools Model Context Protocol (MCP) agent. It contains intentional bugs across various categories for the agent to discover and fix.

## Application Overview
- **Tech Stack**: Angular (Standalone Components), SCSS.
- **Theme**: Premium Dark Mode with Amber accents.
- **Location**: `/src/app`

## Planted Bugs & Scenarios

### 1. Security (Login Page)
*   **Scenario**: User tries to login.
*   **Bugs**:
    *   **Credential Leak**: The console logs the username and password in plain text upon submission.


### 2. Performance (Dashboard)
*   **Scenario**: Viewing the active brew batches and system status.
*   **Bugs**:
    *   **Memory Leak**: An RxJS `interval` subscription creates large objects and pushes them into an array every 20ms. The subscription is never cleaned up, and the array grows indefinitely, eventually causing high memory usage and GC stutter.
    *   **LCP Violation**: The "Live Brewery Cam" loads a 4K unoptimized image from Unsplash, effectively destroying the Largest Contentful Paint score.

### 3. CSS & UI (Recipe Builder)
*   **Scenario**: Adding ingredients to a new recipe.
*   **Bugs**:
    *   **Accessibility**: The "Add +" button has extremely low contrast (Yellow text on Amber background).
    *   **Responsiveness**: The ingredient description uses `white-space: nowrap` without overflow handling, causing the content to break the card layout on smaller screens.
    *   **XSS Vulnerability**: The ingredient "Notes" field allows unsanitized HTML input. While there is no explicit hint, the application uses `[innerHTML]` to render the text, enabling script injection (e.g., `<img src=x onerror=alert('XSS')>`).

### 4. Change Detection (Inventory)
*   **Scenario**: Monitoring stock arriving in real-time.
*   **Bugs**:
    *   **Visual Trap (Auto Refresh)**: The page features an "Auto Refresh" toggle. When enabled, the user expects the list to update automatically as new items arrive. However, the toggle event is bound **outside of Angular's Zone**, so interacting with it intentionally does *not* trigger change detection. This makes it a "hard" trap: the UI remains completely frozen despite user interaction.
    *   **Resolution**: Clicking the small "Refresh" icon 🔄 triggers a manual change detection cycle. The Fix is to use spread syntax or `markForCheck()`.
 
### 5. DOM Performance (System Logs)
*   **Scenario**: Viewing audit logs.
*   **Bugs**:
    *   **DOM Overload**: The page initializes with **10,000 items** rendered immediately using a standard `*ngFor` loop without pagination or virtualization.
    *   **Effect**: Opening this page causes severe UI freeze, main thread blockage, and scroll jank due to the massive number of DOM nodes.
    *   **Resolution**: The agent should diagnose the high DOM node count and refactor the list to use `@angular/cdk/scrolling` (Virtual Scroll).

### 6. Network (Sensors)
*   **Scenario**: Monitoring realtime fermentation data.
*   **Bugs**:
    *   **404 Loop**: The component continuously polls `/api/sensors/data.json` every 2 seconds. Since this endpoint doesn't exist, the Network tab is flooded with red 404 errors.

## How to Run
1.  Navigate to the project directory:
    ```bash
    cd "chrome devtools demo"
    ```
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npx ng serve
    ```
4.  Open `http://localhost:4200` in Chrome.

## Demo Instructions for Agent
Ask the Chrome DevTools MCP Agent to:
1.  "Audit the Login page for credential leaks."

2.  "Analyze the Dashboard performance and find the memory leak."
3.  "Fix the visual bugs and security issues in the Recipe page."
4.  "Enable the 'Auto Refresh' on the Inventory page and explain why it's not working."
5.  "Navigate to the Logs page and fix the scrolling performance issues."
6.  "Debug why the Sensor page is showing an error."
