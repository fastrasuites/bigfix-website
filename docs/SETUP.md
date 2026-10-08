# BigFix Landing Page — Form Submission Setup Guide

## What this provides
- All 3 forms now submit to a PHP backend (`submit.php`) instead of `console.log`
- Submissions are stored in a MySQL database
- An email notification is sent to `info@bigfixtech.com` on every new submission
- Email delivery uses Zoho SMTP (via PHPMailer) as primary, PHP `mail()` as fallback
- No Resend/other third-party services required — pure cPanel
- CI/CD: pushes to `master` auto-deploy via GitHub Actions → FTPS → cPanel

## Files added
```
public/submit.php                 ← Backend endpoint (deploy to public_html/)
public/phpmailer/                  ← PHPMailer library (deployed to public_html/phpmailer/)
public/submit-config.example.php   ← Template: copy to submit-config.php
sql/schema.sql                     ← Run once in phpMyAdmin to create the table
.github/workflows/deploy-cpanel.yml ← CI/CD workflow
```

## Files modified (frontend)
- `src/utils/api.ts` — API utility with form submission + error display
- `src/components/Home/RequestReviewForm.tsx` — full-page review form with error display
- `vite.config.ts` — proxies to production server for local testing
- `src/pages/ContactUs.tsx` — now submits via fetch to `submit.php`
- `src/pages/BookDemo.tsx` — fixed time picker, now submits correctly
- `src/components/common/TextField.tsx` — added controlled props + accessibility
- `src/components/common/SelectField.tsx` — added controlled props + accessibility
- `src/types/forms.ts` — updated prop interfaces

---

## Step-by-step setup

### 1. Local testing (XAMPP/MAMP)

1. Copy `public/submit-config.example.php` → `public/submit-config.php`
2. Edit `public/submit-config.php` with your local DB credentials (`127.0.0.1`, `root`, no password)
3. Import `sql/schema.sql` into your local MySQL (via phpMyAdmin)
4. Install PHPMailer locally: `composer require phpmailer/phpmailer` (or copy the `phpmailer/` folder)
5. Run the React dev server: `npm run dev`
6. Test form submissions — submissions should land in your local DB
7. Email: uses PHP `mail()` locally (or Zoho SMTP if configured)

### 2. Production deployment (cPanel)

#### Step A: Create MySQL database
1. Log into cPanel → **MySQL Databases**
2. Create a new database and user
3. Add the user to the database with **All Privileges**
4. Note the credentials — you'll put them in `submit-config.php`

#### Step B: Email account
1. Go to cPanel → **Email Accounts**
2. Ensure `info@bigfixtech.com` exists with Zoho credentials
3. Note the **email password** — used for SMTP in `submit-config.php`

#### Step C: CI/CD deployment (automatic)

Pushes to `master` automatically deploy via GitHub Actions:
- Builds the React app
- Copies PHP backend + PHPMailer to `dist/`
- Injects `submit-config.php` from the `SUBMIT_CONFIG_B64` secret
- Uploads to `public_html/` via FTPS
- Runs smoke test

### 3. Manual config upload (if CI/CD secret is missing)

If `SUBMIT_CONFIG_B64` GitHub secret is not set, the workflow deploys **without** refreshing `submit-config.php`. You must upload it manually:

1. Edit `public/submit-config.php` with **production** credentials
2. Upload via **cPanel File Manager** or **FTP**:
   - `submit.php` → `public_html/`
   - `submit-config.php` → `public_html/` (keep secret!)
   - `phpmailer/` folder → `public_html/phpmailer/`
3. Run `php -l submit-config.php` to verify syntax before uploading
4. Import `sql/schema.sql` via phpMyAdmin (run once)

### 4. Verify everything works

1. Visit your contact page and submit the form
2. Check that:
   - The form shows a success message (response: `{"success":true,...,"email":"smtp"}`)
   - The submission appears in phpMyAdmin → database → `submissions` table
   - An email notification arrives at `info@bigfixtech.com`
3. If `email:"failed"` appears in the response, check:
   - cPanel → **Errors** for PHP error logs
   - Zoho SMTP credentials in `submit-config.php`
   - Whether outbound SMTP (port 587) is blocked by your host
   - Whether PHP `mail()` is configured (fallback method)

---

## Email configuration

### Email delivery order
1. **Zoho SMTP** (via PHPMailer) — primary method
2. **PHP mail()** — fallback when SMTP fails

### Zoho SMTP settings
```php
'smtp_host'   => 'smtp.zoho.com',
'smtp_port'   => 587,
'smtp_secure' => 'tls',
'smtp_user'   => 'info@bigfixtech.com',
'smtp_pass'   => 'your-zoho-password',
```

### Sender and recipient
Both sender and recipient are `info@bigfixtech.com`:
```php
'from_email' => 'info@bigfixtech.com',
'from_name'  => 'BigFix Website',
'to_email'   => 'info@bigfixtech.com',
```

---

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| `500 Internal Server Error` | Missing `submit-config.php` — upload it via FTP/File Manager |
| `{"email":"failed"}` | SMTP timed out (host blocks port 587) or mail() not configured — check cPanel Errors log |
| `Method not allowed (405)` | ✅ Normal! Submit forms with POST, not GET |
| `Database error` | Check `submit-config.php` DB credentials match cPanel |
| `Class 'PHPMailer' not found` | Upload the `phpmailer/` folder to `public_html/phpmailer/` |
| `SUBMIT_CONFIG_B64` secret broken | Regenerate with: `base64 -w0 submit-config.php` and update the GitHub secret |
| Empty 500 response (no JSON) | Check cPanel → **MultiPHP Manager** for PHP version/parse errors |
| JSON POST returns 406 | Server mod_security may block JSON — use form-encoded POST |

## CI/CD secrets

GitHub → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
| --- | --- |
| `FTP_SERVER` | cPanel server hostname (e.g. `bigfixtech.com`) |
| `FTP_USERNAME` | cPanel FTP user |
| `FTP_PASSWORD` | cPanel FTP password |
| `SUBMIT_CONFIG_B64` | **Base64-encoded** contents of production `submit-config.php` |

### Creating `SUBMIT_CONFIG_B64`

On your server (production), run:
```bash
base64 -w0 submit-config.php
```
Paste the output as the GitHub secret value.

If the secret is missing, the workflow prints a warning and deploys without refreshing `submit-config.php` — the existing config on the server is kept.

---

## Security notes
- `submit-config.php` contains database/SMTP passwords — **never commit it to git**
- `.gitignore` excludes `**/submit-config.php` from version control
- The `sql/` folder is NOT deployed to the web root (security risk)
- All input is sanitized with `htmlspecialchars(strip_tags())` before database insertion
