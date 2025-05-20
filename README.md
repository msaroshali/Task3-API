# 🔍 Maltego Transform Validator Task3

This project automates the validation of Maltego transforms by fetching transform definitions from a remote seed URL, parsing them, and comparing them against a set of expected test cases. It's intended to support quality assurance and consistency checks for Maltego integrations.

---

## 📁 Project Structure
.
├── parse-verify.js # Main script to fetch and validate transforms
├── validate.js # Validation logic for individual transforms
├── test-config.js # Expected transform definitions (test cases)
├── package.json # Project metadata and dependencies

---

## ⚙️ Setup

1. **Clone the repo**:

   ```bash
   git clone https://github.com/your-username/maltego-transform-validator.git
   cd maltego-transform-validator
2. **Install dependencies**
    ```bash
    npm install
3. **Ensure Node.js is ≥ 14, "type": "module" in package.json:**
    ```JSON
    {
        "type": "module"
    }

## 🚀 Usage
Run the main script

    ```bash
    node parse-verify.js

    This will:

    Fetch the seed XML from Maltego.

    Discover transform application URLs.

    Retrieve transform metadata.

    Validate each transform against the expected test cases from test-config.js.

## 📌 Notes
    The script uses ES modules, so all import paths must include .js.

    Output will clearly show which transforms pass/fail based on metadata validation.

    Handles multiple transform applications like Cert Spotter and Live Certs.