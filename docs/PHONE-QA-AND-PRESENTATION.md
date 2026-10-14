# RepairLens: phone QA and presentation guide

This guide is for the **Vercel phone browser preview**. Add the production URL here after deployment: **[Vercel production link pending]**. It is the web build of the Expo project, not an installed Android app or an Expo Go session. All garages, reviews, verification indicators, repair updates and AED prices are fictional demonstration data.

## Before testing or presenting

1. Push the latest ARTDC source files to GitHub. The connected Vercel project builds the web preview from the GitHub version; a local change does not update the deployed site until it is pushed and deployed.
2. Use the Vercel **production** URL for the classroom. If Vercel Deployment Protection asks for authentication, check the project's protection settings or sign in with an authorized account before class.
3. On the phone, open the Vercel production link in Chrome or Safari. Generate a new QR code for that URL after deployment; the old Netlify QR code is retired.
4. Use portrait orientation. Check that the page fills the phone width and that the bottom navigation remains tappable. Use a stable internet connection for the hosted preview.
5. Open **Profile → Reset Demo**, confirm the reset, and return to the Welcome screen before rehearsing. Reset clears this browser's saved demo choices. It does not change another phone's browser data.

## Phone QA checklist

Write **Pass**, **Fail**, or **Not tested** beside each item. Record the phone model, operating system, browser and date at the end.

| ID | Action on phone | Expected result | Result |
| --- | --- | --- | --- |
| 01 | Open the Vercel production link and complete any intended access prompt. | RepairLens Welcome appears; no Expo Go SDK message. | ___ |
| 02 | Tap **Explore demo as guest**. | Home opens without sign-in. Bottom tabs show Home, Analyze, Garages, My Garage and Profile. | ___ |
| 03 | Tap **Change or edit vehicle**. Select the Toyota Corolla and inspect/edit its fields. | Vehicle shows Toyota Corolla, 2022, 85,000 km; Save and Continue controls respond. | ___ |
| 04 | Tap **Continue report problem**, then **Use sample AC issue** and **See preliminary guidance**. | Guidance explains possible causes and states that a qualified mechanic must confirm the diagnosis. | ___ |
| 05 | Tap **Analyze sample quotation**. | The example shows AED 750 compressor + AED 250 labour + AED 100 inspection = **AED 1,100**. Uploaded files are not claimed to have been analyzed. | ___ |
| 06 | Tap **View Repair Protection Score**, then **Generate questions for mechanic**. | Score is **65/100** for documentation completeness. Missing part/warranty details and an example question appear. No honesty claim appears. | ___ |
| 07 | Try **Copy message**. | A success message appears and the text can be pasted elsewhere, or a clear fallback message appears if the browser blocks copying. | ___ |
| 08 | Tap **Compare fictional garages**. Try **Longest warranty**, then **Lowest price**. | Three fictional garages reorder. Compare part category, scope, warranty and timing as well as amount. | ___ |
| 09 | Open **Harbour Auto Studio** with **View Trust Passport**. | Profile and simulated trust indicators appear. Its confirmed quote is **AED 950**. | ___ |
| 10 | Select Harbour Auto Studio and tap **Approve repair · AED 950**. | Quote Lock records the approval and authorized total is **AED 950**. | ___ |
| 11 | Tap **Show additional request**, then **Decline additional work**. | AED 300 request is recorded as declined; authorized total stays **AED 950**. Approval history shows both decisions. | ___ |
| 12 | Tap **Track this repair**. Advance each **Demo next stage** button, then **Collect & save repair history**. | Timeline advances to Ready for Collection and My Garage opens. | ___ |
| 13 | Tap **View repair & invoice**. | Completed record shows Harbour Auto Studio and the same authorized amount, **AED 950** for the decline path. | ___ |
| 14 | Reload the page, return to My Garage and Quote Lock. | Saved vehicle, decisions and record remain in this browser. | ___ |
| 15 | Go to **Profile → Reset Demo** and confirm. | Welcome returns and the classroom scenario can start again. | ___ |
| 16 | Repeat steps 02–10, but **Approve additional work** at step 11. | Proposed total and authorized total become **AED 1,250**; later record uses that amount. | ___ |
| 17 | Check narrow screen layout: scroll each major screen, tap Back, use bottom tabs, and focus form fields. | Text is readable; buttons and bottom tabs are accessible; no important control is cut off. | ___ |

### Optional checks

- On Report, try submitting an incomplete issue and confirm that validation appears. Use the sample issue afterward.
- On Vehicle, try an invalid year or mileage and confirm that the form explains the problem. Restore the sample Corolla afterward.
- On Analyze, choose an image or document only if the phone browser supports it. The app must say that real document extraction is unavailable; use the sample quotation for the presentation.
- On Tracking, tap **View inspection note**. It should open a clearly labelled sample note.
- On Profile, tap **Reset Demo** and cancel once. Existing progress should remain.

**QA record:** Date: ______  Phone/OS: ______  Browser/version: ______  Vercel site accessible: ______  Tester: ______

**Issues found:** Note the screen, exact tap, expected result, actual result and a screenshot if possible. Do not mark a step as passed without trying it on the phone.

## Four-minute classroom demonstration

Reset the demo immediately before class. Keep the Vercel production tab open on the phone, confirm access works, and connect the phone to the projector or screen mirroring setup. Open the [Repair Audit Card](../repair-audit-card.html) or bring its A5 printout.

| Time | What to tap | What to say |
| --- | --- | --- |
| 0:00–0:25 | Open RepairLens via the QR/link; **Explore demo as guest**. | “This is a browser preview of our Expo mobile prototype. The customer can begin without an account.” |
| 0:25–0:50 | **Change or edit vehicle** → Toyota Corolla → **Continue report problem**. | “Our scenario is a 2022 Corolla in Dubai. The vehicle context follows the customer through the journey.” |
| 0:50–1:15 | **Use sample AC issue** → **See preliminary guidance**. | “The app explains possible causes in plain language. It does not inspect the car or make a final diagnosis.” |
| 1:15–1:45 | **Analyze sample quotation** → **View Repair Protection Score** → **Generate questions for mechanic**. | “The sample quote totals AED 1,100. The 65/100 score measures what the document explains, not whether a mechanic is honest.” |
| 1:45–2:20 | **Compare fictional garages**; change sort; open Harbour Auto Studio's **View Trust Passport**. | “Price is shown alongside part type, warranty and completion time. Every garage and review here is fictional.” |
| 2:20–3:05 | Select Harbour Auto Studio → **Approve repair · AED 950** → **Show additional request** → **Decline additional work**. | “Quote Lock records what the customer authorized. The extra AED 300 request cannot silently change this demo's authorized AED 950 total.” |
| 3:05–3:40 | **Track this repair**; advance sample stages → **Collect & save repair history** → **View repair & invoice**. | “Tracking and evidence notes are simulated. The record keeps the approved amount consistent.” |
| 3:40–4:00 | Show the printed Repair Audit Card and slide 12. | “The card turns the same questions into a simple checklist customers can use at a garage.” |

For slide 11, show the journey: **understand → check quote → compare → authorize → track**. For slide 12, use the [feature-to-pain-point matrix](FEATURE-PAIN-POINT-MATRIX.md): jargon → plain guidance; vague quotes → item explanation and missing details; uncertain garage choice → comparable profiles; surprise charges → recorded approval; unclear completion → timeline and history. Do not present these prototype examples as user research findings.

### If a live step fails

- **Vercel access page:** use the production URL and check Deployment Protection. If access is unavailable, do not claim the app is running; use your prepared slides and explain the planned journey.
- **File selection or clipboard problem:** continue with **Use sample AC issue** and **Analyze sample quotation**. These are the complete demonstration paths.
- **Demo starts mid-journey:** use **Profile → Reset Demo** and confirm. If reset fails, report that as a QA issue and use a fresh browser session for the presentation.
- **Expo Go mismatch:** open the Vercel production link in the phone browser. Expo Go 57 cannot run this SDK 54 native project.

## Claims to keep accurate

The guidance and quote explanations are simulated AI demonstrations. The score assesses document completeness. The garage profiles, reviews, verification indicators, AED prices and repair updates are fictional. Quote Lock records a customer's choice locally; it does not create legal enforcement or process payment. The Vercel page is a web preview of the mobile prototype; native phone behavior still needs separate device testing.
