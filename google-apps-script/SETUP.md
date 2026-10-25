# Send website form submissions to Google Sheets

Every time someone submits the **"Book a free growth audit"** form (home page) or sends their **Growth Scorecard** results, a new row is added to your Google Sheet:

- **Enquiries** tab: name, restaurant, phone/WhatsApp, email, city, platforms, message
- **Scorecard** tab: name, restaurant, contact details, overall score, top priorities, score per area

The tabs and header rows are created automatically on the first submission. Setup takes about 5 minutes.

## 1. Create the sheet and the script

1. Go to https://sheets.new and name the sheet, e.g. **KitchenMath Leads**.
2. In the sheet, open **Extensions → Apps Script**.
3. Delete the sample code, then paste in everything from `google-apps-script/Code.gs`.
4. On the line `const SECRET = "change-me-to-a-long-random-string";` replace the text with your own long random string (e.g. `km-7f3a9c21e84b4d0f`). Keep it private.
5. Click **Save** (💾).

## 2. Publish it as a web app

1. Click **Deploy → New deployment**.
2. Click the ⚙️ next to "Select type" and choose **Web app**.
3. Set **Execute as: Me** and **Who has access: Anyone**. (Anyone can call the URL, but rows are only added when the secret matches.)
4. Click **Deploy**, then **Authorize access** and allow it with your Google account. If you see "Google hasn't verified this app", click **Advanced → Go to … (unsafe)**. It's your own script.
5. Copy the **Web app URL** (it ends in `/exec`).

Check it: open the URL in your browser. You should see `{"ok":true,"message":"KitchenMath sheet webhook is running."}`.

## 3. Connect the website

Add two environment variables.

**Local** (`.env.local` in the project folder):

```bash
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXXXXXX/exec
GOOGLE_SHEETS_SECRET=km-7f3a9c21e84b4d0f
```

Restart `npm run dev` after changing `.env.local`.

**Vercel:** Project → **Settings → Environment Variables** → add the same two, then **Redeploy**.

## 4. Test

Open the home page, fill the form at the bottom and press **Request my free growth audit**. A new row should appear in the **Enquiries** tab within a few seconds.

## 5. Ad source columns (update from October 2026)

Every row now also records where the visitor came from, in five new columns at the end:

| Column | Example | Comes from |
|---|---|---|
| Source | `meta / paid` | `utm_source` / `utm_medium` on the ad link; `meta / click (no UTM tags)` for untagged Meta links; `google.com / referral` for other websites; `Direct / unknown` if nothing was recorded |
| Campaign | `contact_leads` | `utm_campaign` |
| Ad / hook | `hook1` | `utm_content` |
| Keyword | | `utm_term` (Google Ads only) |
| Landing page | `/contact` | the first page they opened from that source |

The source is remembered for 30 days, so a visitor who clicks the ad, leaves, and comes back later to fill the form still shows the ad as the source.

**If you already set up the sheet before this update:**

1. Open the sheet → **Extensions → Apps Script**.
2. Paste in the new `Code.gs`, but **keep your own SECRET line** (copy it first).
3. **Save**, then **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same, so nothing changes in Netlify/Vercel.
4. The five new headings are added automatically on the next submission. If you added your own columns (for example "Called?") to the right of **Page**, move them further right first, because the new columns are written straight after **Page**.

Until you update the script, the website keeps working: the extra data is simply ignored.

## Good to know

- **Changed the script?** Use **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**. The URL stays the same. (A *New deployment* creates a new URL, which you'd then need to update in the env vars.)
- **Email alerts for new rows:** in the sheet, **Tools → Notification settings → Edit notifications → "Any changes are made" → Email right away**.
- **Spam:** the forms have a hidden "honeypot" field that bots fill in; those submissions are silently dropped.
- **Not getting rows?** Check that the secret is identical in both places, the deployment access is **Anyone**, and the URL ends in `/exec` (not `/dev`). Vercel → your project → **Logs** shows the error if the webhook call fails.
