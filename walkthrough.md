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
    *   **Credential Leak**: The console logs the username and password in plain text upon submission.


### 2. Performance (Dashboard)
*   **Scenario**: Viewing the active brew batches and system status.
*   **Bugs**:
    *   **Layout Thrashing**: The "System Status" card contains a hidden interval that forces layout recalculations (read/write loop) every 50ms, causing high CPU usage and frame drops.
    *   **LCP Violation**: The "Live Brewery Cam" loads a 4K unoptimized image from Unsplash, effectively destroying the Largest Contentful Paint score.

### 3. CSS & UI (Recipe Builder)
*   **Scenario**: Adding ingredients to a new recipe.
*   **Bugs**:
    *   **Accessibility**: The "Add +" button has extremely low contrast (Yellow text on Amber background).
    *   **Responsiveness**: The ingredient description uses `white-space: nowrap` without overflow handling, causing the content to break the card layout on smaller screens.
    *   **XSS Vulnerability**: The ingredient description field supports "Rich Text" by bypassing Angular's security trust. It allows unsanitized HTML, enabling XSS via the description input (e.g., `<img src=x onerror=alert('XSS')>`).

### 4. Change Detection (Inventory)
*   **Scenario**: Monitoring stock arriving in real-time.
*   **Bugs**:
    *   **UI Freeze (OnPush Mutation)**: The component uses `ChangeDetectionStrategy.OnPush` but updates the stock list by pushing to an existing array (mutation) instead of creating a new reference. As a result, new items arrive in the background (visible in console), but the UI does not update.

### 5. Network (Sensors)
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

2.  "Analyze the Dashboard performance and fix the layout thrashing."
3.  "Fix the visual bugs and security issues in the Recipe page."
4.  "Investigate why the Inventory list isn't updating."
5.  "Debug why the Sensor page is showing an error."
