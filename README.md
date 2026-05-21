# The Big Apple's Big Brother Problem

A civic journalism and advocacy webpage about LinkNYC — the city-franchised
surveillance network operating across the five boroughs — and the pending
New York State legislation that would address it.

**Primary goal:** Inform New Yorkers about how LinkNYC works, what the KPMG
audit found, and why the Digital Fairness Act (S4276 / A3308) matters.
Make it easy for readers to contact their representatives and support the bill.

---

## The story in brief

LinkNYC was sold to New York City as a digital equity programme — free gigabit
Wi-Fi for the boroughs that needed it most. What it built instead was the
largest warrantless surveillance network in the five boroughs, concentrated
in the neighbourhoods least positioned to push back.

Every kiosk passively logs the MAC address of every phone that passes within
range — no Wi-Fi connection required, no consent asked. A KPMG audit
commissioned by the city's Office of Technology and Innovation found that
these device fingerprints were stored in plaintext for years, in direct
violation of CityBridge's own privacy policy. Because CityBridge is a
private contractor, not the NYPD, the entire network operates outside the
POST Act oversight regime that governs the city's other surveillance tools.

The Digital Fairness Act (NY Senate S4276 / Assembly A3308) would close
that loophole. It is in committee. It can still pass this session.

---

## The bill

| | |
|---|---|
| **Senate Bill** | S4276 |
| **Assembly Bill** | A3308 |
| **Short title** | Digital Fairness Act |
| **Status** | In Committee on Internet & Technology (introduced Feb 2025) |
| **What it does** | Requires affirmative consent before personal data is collected; closes the private-contractor exemption the POST Act left open; bans discriminatory targeted advertising |
| **Supporter** | NYCLU (formal legislative memo on record) |

---

## How to view

The page is a single self-contained file — no build step, no dependencies
to install. Open `index.html` in any modern browser.

The live kiosk map and broadband chart fetch external data, so they require
an internet connection. Opening via `file://` works for most content;
if the map tiles or NYC Open Data fetch fail, serve the directory over HTTP:

```bash
python3 -m http.server 8765
# then open http://localhost:8765
```

---

## What's in the page

| Section | Contents |
|---|---|
| **Hero** | Headline, three live BANs (active kiosks, mandated target, re-identification threshold) |
| **The Finding** | NYPD vs. LinkNYC double-standard comparison — same Wi-Fi geolocation capability, completely different legal thresholds |
| **The Machine** | How each kiosk works as a sensor hub; the advertising business model that requires it |
| **The Map** | Live Leaflet map of every kiosk coloured by generation, with detection-range halos and scrollytelling panels (Manhattan → all boroughs → Bronx) |
| **The Audit** | KPMG findings PF-01 through PF-04 — the plaintext MAC storage violation, the misattributed privacy policy, the missing unsubscribe link |
| **Who Pays** | The inverted-equity pattern: wealthier districts stalled Link5G installations; mandated outer-borough districts had no equivalent civic mechanism to push back |
| **The Fix** | Digital Fairness Act details, bill status, and what it would actually change |
| **Act Now** | Copyable campaign letter + links to find your State Senator, Assembly Member, and the Governor |

---

## Tech stack

Pure HTML/CSS/JS — single self-contained file, no framework, no build step.

| Tool | Use |
|---|---|
| [GSAP 3](https://gsap.com) | ScrollTrigger, SplitText, ScrambleTextPlugin, quickTo — all loaded via CDN |
| [Leaflet.js](https://leafletjs.com) | Interactive kiosk map |
| [CARTO](https://carto.com/basemaps/) | Dark and light map tiles (swapped on theme toggle) |
| [Chart.js](https://www.chartjs.org) | Broadband-need vs. Link5G deployment bar chart |
| [NYC Open Data](https://data.cityofnewyork.us/Social-Services/LinkNYC-Kiosk-Locations/s4kf-3yrf) | Live kiosk location data (endpoint `s4kf-3yrf`) |
| Google Fonts | Figtree (headings) + Oxygen (body) |

---

## Primary sources

- [NY Senate Bill S4276 — Digital Fairness Act](https://www.nysenate.gov/legislation/bills/2025/S4276)
- [NYCLU Legislative Memo — Digital Fairness Act](https://www.nyclu.org/resources/policy/legislations/legislative-memo-digital-fairness-act)
- [NYPD POST Act — WiFi Geolocation Tracking Devices IUP](https://www.nyc.gov/site/nypd/about/about-nypd/policy/post-act.page)
- KPMG audit of LinkNYC (OTI, Jan 2023, redacted)
- CityBridge remediation letter to OTI, Dec 2022
- NYCLU testimony to NYC Council Tech Committee, Jun 2023
- [NYCLU — "LinkNYC is a Privacy Disaster"](https://www.nyclu.org/commentary/linknyc-privacy-disaster-heres-why)
- NYC OTI Internet Master Plan / Truth in Broadband Report (ACS 5-year, 2018–2022)
- Tandfonline (2025) — "Digital policing of homeless and other marginalised groups in smart cities"
