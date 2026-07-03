# My LeetCode Journey Portfolio Website

Welcome to the documentation for **My LeetCode Journey**, a modern, responsive, single-page portfolio website showcasing all your solved coding solutions from LeetCode and GeeksforGeeks.

This portfolio is built entirely using:
- **HTML5**
- **CSS3 (Vanilla CSS)**
- **Vanilla JavaScript**

No frameworks, CDNs, or external backends are used. The frontend fetches data from a locally generated `data.json` file.

---

## 🚀 How to Run Locally

You can run the portfolio locally on your machine in two ways:

### Option 1: Direct Execution
1. Open the [index.html](file:///Users/sandeepprajapati1202/Downloads/Personal/lc/index.html) file directly in any modern web browser (Double-click or drag-and-drop).

### Option 2: Local HTTP Server (Recommended)
Running through an HTTP server ensures all features work correctly and mimics production conditions:
1. Open your terminal in the repository folder.
2. Start a simple HTTP server using Node or Python:
   - **Node.js (using `npx`):**
     ```bash
     npx serve .
     ```
   - **Python 3:**
     ```bash
     python -m http.server 8000
     ```
3. Open your browser and navigate to the address shown (usually `http://localhost:3000` or `http://localhost:8000`).

---

## 🛠️ Data Regeneration

Whenever you add a new problem folder (e.g. `0578-some-problem/` with a `solution.java` and `README.md`) or change existing code, you must update the `data.json` catalog.

1. Run the local Node script in the root directory:
   ```bash
   node generate_data.js
   ```
2. The script scans your directories recursively, parses details from your `README.md` files (such as platform, difficulty, problem title, and languages), and outputs a clean `data.json` database.

---

## 🌐 Deploying to GitHub Pages

GitHub Pages allows you to host this portfolio website for **free** directly from your repository. Follow these steps to deploy it:

### Step 1: Push Your Files to GitHub
Make sure all files are committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "feat: setup portfolio website files"
git push origin main
```

### Step 2: Configure GitHub Pages Settings
1. Navigate to your GitHub repository page: [https://github.com/simplysandeepp/lc](https://github.com/simplysandeepp/lc).
2. Click on the **Settings** tab at the top.
3. On the left sidebar, click on the **Pages** menu item (under the "Code and automation" section).
4. Under the **Build and deployment** section:
   - **Source:** Select **Deploy from a branch**.
   - **Branch:** Select `main` (your default branch) and `/ (root)` folder.
5. Click **Save**.

### Step 3: View Your Live Portfolio!
Within a minute, GitHub will build and publish your site. A link will be displayed at the top of the Pages settings page, typically looking like:
**`https://simplysandeepp.github.io/lc/`**

---

## 🤖 Automated GitHub Action Workflow

To keep your portfolio completely hands-free, we have set up a GitHub Action workflow in [rebuild.yml](file:///Users/sandeepprajapati1202/Downloads/Personal/lc/.github/workflows/rebuild.yml).

### How it works:
1. **Triggers:** Every time you push a commit to the `main` branch containing changes to solutions (e.g., `.java`, `.sql`, `.py` files) or `README.md` files.
2. **Action Steps:**
   - Checks out the latest code.
   - Installs Node.js.
   - Runs `node generate_data.js` inside the runner.
   - Checks if `data.json` has changed.
   - If changed, commits the updated `data.json` and pushes it back to your `main` branch using a bot user with `[skip ci]` to prevent build loops.
3. **Outcome:** Since GitHub Pages is configured to build from the `main` branch, updating `data.json` immediately triggers a Pages deployment refresh. Your portfolio updates live without you ever running manual commands!

---

## 🎨 Features & Highlights

- **Interactive UI/UX**: Custom-designed CSS background glow animations, premium card hover scaling, and glassmorphic panels.
- **Persistent Light & Dark Theme**: Supports theme preference toggling that persists across browser sessions using `localStorage`.
- **Search & Filters**: Performant filtering by Platform (LeetCode vs GFG), Difficulty (Easy/Medium/Hard), and Language (Java/SQL/Python), and search by title or number (such as `#0001` or `Two Sum`).
- **High Performance Grid**: Employs lazy pagination (chunks of 24 solutions) to render 600+ cards smoothly with 0% browser stuttering.
- **Dashboard Metrics**: Interactive cards displaying totals and difficulty/language tallies with smooth counting animations.
