### Hexlet tests and linter status:
[![Actions Status](https://github.com/xenia513/qa-auto-engineer-javascript-project-87/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/xenia513/qa-auto-engineer-javascript-project-90/actions)

# 🎭 Playwright E2E Testing Framework

This project is an automated testing framework built for a **React + Vite** web application.

## 🏗 Framework Architecture

The project uses advanced **Playwright** patterns to keep tests fast and easy to maintain:

*   **Base Page Object Model (POM):** Common logic like navigation, table handling, selects, and error validation is moved to a single `BaseMVCPage.js`.
*   **Shared Auth:** Login is performed once in `auth.setup.js`. The session state is saved and reused in all tests to save time.
*   **Smart Fixtures:** A custom `testData` fixture automatically generates unique data (Users, Labels, Tasks) before each test.
*   **Dynamic Locators:** Reliable ways to find elements using IDs from attributes or searching table rows by text.

## 🚀 Tech Stack

*   **Playwright** — core test engine.
*   **Faker.js** — generating unique test data.
*   **GitHub Actions** — CI/CD pipeline for automatic test runs.
*   **JavaScript (ES6+)** — modern coding standards.

## 🛠 How to Run

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/xenia513/qa-auto-engineer-javascript-project-90
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    npx playwright install --with-deps
    ```

3.  **Run tests:**
    *   `npx playwright test` — Run all tests.
    *   `npx playwright test --ui` — Open interactive UI mode (best for debugging).
    *   `npx playwright show-report` — View the HTML test report.

## 🧪 Test Coverage (50+ Scenarios)

*   **Authorization:** Login, empty field validation, and error handling.
*   **CRUD Operations:** Create, Edit, and Delete (single and mass delete) for Users, Labels, Statuses and Tasks.
*   **Kanban Board:** Complex **Drag-and-Drop** logic for moving tasks between columns.
*   **Filters:** Testing filters by assignee, status, and labels.
*   **Pagination:** Switching pages and changing the number of items per page.