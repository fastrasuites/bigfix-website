# BigFix Landing Page — Form Submission Setup Guide

## What this provides
- All 3 forms now submit to a PHP backend (`submit.php`) instead of `console.log`
- Submissions are stored in a MySQL database
- An email notification is sent to `info@bigfixtech.com` on every new submission
- No Supabase/Resend/other third-party services required — pure cPanel

## Files added
```
public/submit.php              ← Backend endpoint (deploy to public_html/)
public/submit-config.sample.php ← Template: copy to submit-config.php
sql/schema.sql                  ← Run once in phpMyAdmin to create the table
vendor/                         ← PHPMailer library (install via Composer on host)
```

## Files modified (frontend)
- `src/utils/api.ts` — API utility for form submissions
- `src/pages/ContactUs.tsx` — now submits via fetch to `submit.php`
- `src/pages/BookDemo.tsx` — fixed time picker (3 separate selects), now submits correctly
- `src/components/Home/RequestReviewForm.tsx` — converted to controlled form, now submits correctly
- `src/components/common/TextField.tsx` — added controlled `value`/`onChange` props + `id`/`htmlFor`
- `src/components/common/SelectField.tsx` — added controlled `value`/`onChange` props + `id`/`htmlFor`
- `src/types/forms.ts` — updated prop interfaces

---

## Step-by-step setup

### 1. Local testing (XAMPP/MAMP)

1. Copy `public/submit-config.sample.php` → `submit-config.php`
2. Edit `submit-config.php` with your local DB credentials (`root`, no password)
3. Import `sql/schema.sql` into your local MySQL (via phpMyAdmin)
4. Install PHPMailer locally: `composer require phpmailer/phpmailer`
5. Run the React dev server: `npm run dev`
6. Test all 3 forms — submissions should land in your local DB and email send (use Mailtrap for testing)

### 2. Production deployment (cPanel)

#### Step A: Create MySQL database
1. Log into cPanel → **MySQL Databases**
2. Create a new database (e.g., `bigfix_forms`)
3. Create a database user (e.g., `bigfix_user`) with a strong password
4. Add the user to the database with **All Privileges**
5. Note the credentials — you'll put them in `submit-config.php`

#### Step B: Create email account
1. Go to cPanel → **Email Accounts**
2. Create `info@bigfixtech.com` (or use your existing one)
3. Note the **email password** — you'll use it for SMTP

#### Step C: Upload files to server
Via **cPanel File Manager** or **FTP**:

1. Upload `submit.php` to `public_html/`
2. Upload `submit-config.php` (the one you edited) to `public_html/`
3. Upload the `vendor/` folder to `public_html/` (contains PHPMailer)
4. Upload `submit-config.sample.php` and `sql/schema.sql` for reference

> Make sure `submit-config.php` is **not** web-accessible: either keep it outside `public_html/` or put `.htaccess` with `deny from all` in a protected folder. Alternatively, configure your web server to deny direct access to `.php` files outside of `submit.php`.

#### Step D: Create the database table
1. Go to cPanel → **phpMyAdmin**
2. Select your new database
3. Click **Import** → choose `sql/schema.sql` → **Go**

#### Step E: Configure cron (optional)
For housekeeping, run once daily:
```bash
0 2 * * * curl -s https://bigfixtech.com/admin/cleanup.php
```

### 3. Verify everything works

1. Visit your contact page: `https://bigfixtech.com/contact`
2. Submit the contact form with test data
3. Check that:
   - You see a success message on the form
   - The submission appears in phpMyAdmin → your database → `submissions` table
   - An email notification arrives at `info@bigfixtech.com`
4. Repeat for Book Demo form (`/book-demo`) and Home review form (`/`)

### 4. Email configuration notes
- **SMTP host**: usually `mail.bigfixtech.com` (same as your domain)
- **SMTP port**: `465` (SSL) or `587` (TLS)
- **Encryption**: `ssl` for port 465, `tls` for port 587
- Test SMTP settings using cPanel → **Email Accounts** → select your account → **Connect Apps** → **Mail Client Information**

## Troubleshooting

| Issue | Resolution |
| --- | --- |
| `Method not allowed` | Make sure `submit.php` is uploaded to `public_html/` |
| `Database error` | Check `submit-config.php` values match cPanel MySQL database |
| `Configuration file missing` | You forgot to copy `submit-config.sample.php` → `submit-config.php` |
| Email not arriving | Check spam folder; verify SMTP credentials; confirm port/encryption match cPanel |
| PHPMailer not found | Ensure the `vendor/` folder was uploaded to `public_html/` |
| 500 Internal Server Error | Check cPanel → **Errors** for PHP errors; enable `display_errors` temporarily |

## Security notes
- `submit-config.php` contains database and SMTP passwords — **never commit it to git** or make it web-accessible
- The PHP endpoint includes CORS headers for development; restrict `Access-Control-Allow-Origin` to your domain in production
- All input is sanitized with `htmlspecialchars(strip_tags())` before database insertion
- Consider adding rate-limiting/honeypot fields to prevent spam
