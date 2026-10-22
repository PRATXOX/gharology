# ghar.o.logy: single-page landing site (Godrej Global Business City, Greater Noida)

Plain HTML/CSS/JS, no build step. Files: `index.html`, `styles.css`, `script.js`, `config.js`, `README.md`.
Status: syntax and internal links checked offline. **Not yet tested on a live Netlify site or in real browsers.**

## 1. Edit settings (`config.js`)
Phone (`+919876543210`), WhatsApp (digits only, `919876543210`), `legalName`, `privacyEmail`, and the six `details` facts (verified information only). Anything left empty shows "Contact Us for Latest Details". Until valid numbers are set, Call/WhatsApp buttons scroll to the form instead of linking to a fake number. Also replace `https://YOUR-DOMAIN.example` in the canonical/og tags of `index.html` once you have your domain.

## 2. Upload to Netlify
Unzip, then go to app.netlify.com/drop and drag the `ghar-o-logy-landing` folder in. Netlify detects the `enquiry` form from the static HTML. If it doesn't appear: Site configuration → Forms → enable form detection, then redeploy.

## 3. Test the lead form (live site only)
1. Submit with empty fields, then a bad mobile (`12345`, `5123456789`): errors must show.
2. Submit a valid test enquiry: button shows "Sending…", then the thank-you panel appears.
3. Netlify → Forms → *enquiry*: the entry must be there (export CSV; add email alerts under Form notifications).
4. Block the network and submit: you must see the error, not a thank-you.
5. A filled hidden honeypot creates no entry.
Opening the file locally (not via Netlify) will show the error state; that is expected.

## 4. Meta Pixel (ID 2519771221780938)
- A banner offers Accept and Reject; the Pixel loads only after Accept ("Cookie settings" in the footer reopens the choice). Set `consentRequired:false` only on legal advice.
- Events: **PageView** on load (after Accept), **Contact** on a click of a working Call/WhatsApp button (once each per visit), **Lead** only after Netlify accepts a submission (once). No personal data is sent.
- Verify: set `testMode:true`, open the live site, click Accept. In Meta Events Manager → Data Sources → select the Pixel → **Test Events**, enter your site URL, and confirm PageView, Contact and Lead. Repeat with Reject to confirm nothing arrives. Set `testMode:false` afterwards. The Pixel is not confirmed active until you see these events there.

## 5. Final checks
Click every button; check the mobile layout and the sticky Call/WhatsApp bar on a real phone; confirm the bar never hides the consent banner or form. Add a custom domain under Domain management (HTTPS is automatic).
