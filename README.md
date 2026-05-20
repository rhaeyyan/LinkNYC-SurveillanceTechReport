# NYC Surveillance Tech — Data School Application Project

An interactive single-page infographic and accompanying deep-dive report on
LinkNYC, the NYPD Domain Awareness System, and the regulatory gap that lets
private surveillance infrastructure operate outside municipal oversight law.

Prepared as a portfolio piece for the
[Data School (UK) admissions application](https://www.thedataschool.co.uk/apply/).

## Files

| File | Purpose |
|---|---|
| `infographic.html` | Single-file interactive infographic (Tailwind + Chart.js + Leaflet via CDN). |
| `NYC Surveillance Tech Deep Dive.md` | Source research report &mdash; the long-form material the infographic distils. |
| `README.md` | This file. |

## How to view the infographic

The page fetches live data from NYC Open Data (LinkNYC kiosk locations) and
loads tiles from CARTO. Opening `infographic.html` directly via `file://`
will work for static content, but **the live map, broadband-vs-deployment chart,
cumulative activations chart, and live kiosk counts may fail** because browsers
restrict `fetch()` for `file://` origins.

The cleanest way to view it is to serve the directory over HTTP. Any of the
following will work:

### Option A &mdash; Python (no install needed on most systems)

```bash
cd /path/to/SurveillanceTechInNYC
python3 -m http.server 8765
```

Then open <http://localhost:8765/infographic.html> in any modern browser.

### Option B &mdash; Node

```bash
npx serve .
```

### Option C &mdash; VS Code

Install the **Live Server** extension, right-click `infographic.html`, choose
*Open with Live Server*.

### Requirements

- A modern browser (Chrome, Firefox, Safari, Edge).
- Internet access &mdash; the page pulls from `data.cityofnewyork.us` and a
  handful of CDNs (Tailwind, Chart.js, Leaflet, CARTO tiles).
- No build step, no dependencies, no API keys.

## What's in the infographic

| Section | What it shows |
|---|---|
| **The Trojan Horse** | LinkNYC's pitched utility vs. its actual function as an ad/sensor network; the CityBridge consortium ownership chain (Intersection &times; Qualcomm &times; Boldyn Networks). |
| **Geography of Surveillance** | Live Leaflet map of every approved kiosk colored by generation; broadband-deficit vs. kiosk-share comparison; deployment progress against the 7,500-kiosk mandate; the 13 mandated Link5G community districts. |
| **The Privacy Disaster** | Re-identification stat trio (3 location points &middot; live kiosk count &middot; 7,500 mandated); sourced surveillance-modality matrix. |
| **A Decade of Quiet Concessions** | Cumulative kiosk activations computed live from NYC Open Data; 13-step annotated chronology spanning 2014&ndash;Feb 2026. |
| **The KPMG Audit** | The four POST Act audit findings (PF-01&ndash;04) with severity badges and remediation status, plus the audit-timeline strip. |
| **NYPD Domain Awareness System** | The "WiFi Geolocation Tracking Devices" smoking-gun callout linking LinkNYC's MAC harvesting to NYPD's own POST Act disclosures; a sourced double-standard comparison; six KPI tiles; log-scale database composition chart; LinkNYC&rarr;DAS flow diagram. |
| **The Surveillance Divide** | Inverted-equity logic chart; paired civic-agency disparity cards; London/Tower Hamlets parallel; the Smart Kiosk Regulatory Gap callout; legislative status (POST Act enacted, Digital Fairness Act pending). |

## Data sources

All data is either pulled live or cited inline:

- **NYC Open Data** &mdash; [LinkNYC Kiosk Locations (`s4kf-3yrf`)](https://data.cityofnewyork.us/Social-Services/LinkNYC-Kiosk-Locations/s4kf-3yrf) (fetched on page load).
- **NYC OTI Internet Master Plan / Truth in Broadband Report** &mdash; borough-level broadband-deficit estimates (ACS 5-year, 2018&ndash;2022).
- **OTI KPMG Privacy Audit (Jan 2023 publication)** + **CityBridge remediation letter (Dec 2022)** + **NYCLU testimony (Jun 2023)**.
- **NYPD POST Act Impact &amp; Use Policies** &mdash; [nyc.gov/site/nypd/about/about-nypd/policy/post-act.page](https://www.nyc.gov/site/nypd/about/about-nypd/policy/post-act.page) (DAS, Facial Recognition, WiFi Geolocation Tracking Devices IUPs cited).
- **City &amp; State NY (2019)** &mdash; NYPD DAS scale figures.
- **EPIC** &mdash; "digital frisking" framing on facial-recognition disparity.
- **S.T.O.P. + ECBAWM** &mdash; litigation context.
- **NYCLU**, **EFF**, **NY Landmarks Conservancy**, **MAS** &mdash; civic-society pushback.
- **Tandfonline (2025)** &mdash; London/Tower Hamlets parallel.

The donut chart in the intro section is the one remaining editorial estimate;
the footer methodology block flags this explicitly. Every other visualization
either pulls from a live endpoint or cites a primary source.

## Executive summary of the deep-dive report

LinkNYC was launched in 2014 as a replacement for New York City's expiring
payphone franchise, marketed as a public utility that would close the digital
divide through free gigabit Wi-Fi, device charging, and domestic calls.
Behind that pitch sits a different kind of infrastructure: a privately
operated, ad-funded sensor network of 9.5-ft kiosks (Link1.0) and 32-ft
smart poles (Link5G) that passively log device MAC addresses, record video,
and harvest environmental data &mdash; a system explicitly engineered by
operator Intersection to enable "hypertargeting in the physical world."

The franchise has been characterised by regulatory failure at every layer.
The State Comptroller found that the city's Office of Technology and
Innovation (OTI) failed to monitor CityBridge's compliance; the consortium
accumulated roughly $70&nbsp;million in unpaid dues and approached bankruptcy
by 2019. A KPMG privacy audit conducted in 2021 and quietly released in
January 2023 (heavily redacted, no press notice) confirmed four findings,
the most serious being that CityBridge had stored MAC addresses in
plaintext for years &mdash; in direct violation of its own privacy policy.
A hashed-MAC remediation was deployed in late 2022.

LinkNYC's data is connected to the city's broader surveillance apparatus
through the NYPD Domain Awareness System (DAS) &mdash; a 2012 Microsoft-built
fusion platform funded with $350&nbsp;million in DHS grants and connected to
18,000+ CCTV cameras, two billion license-plate reads, eleven million arrest
records, and tens of millions of 911 calls, summonses, and detective
reports. CityBridge's privacy policy permits voluntary disclosure of
LinkNYC video to the NYPD without a warrant; documented hand-offs have
already occurred. Although the system itself uses no built-in
biometrics, the DAS Impact &amp; Use Policy disclosed under the POST Act
confirms that still frames may be extracted and run retrospectively
through external facial-recognition tools (Dataworks+, Idemia).

The franchise's spatial story is one of inverted equity. The original
Link1.0 deployment concentrated 55% of kiosks in Manhattan because the
advertising business model rewarded high-density, high-income foot
traffic. The 2020 Link5G corrective mandate now requires 90% of new
kiosks to be installed in the outer boroughs or above 96th Street &mdash;
739 mandated across 13 community districts including Brownsville,
Hunts Point, Jamaica, Inwood, and Stapleton. These are the neighbourhoods
with the highest broadband deficits *and* the longest histories of
aggressive policing. The "digital divide" is not bridged; it is replaced
by a "surveillance divide" in which connectivity is purchased with personal
privacy.

The structural failure is reinforced by a disparity in civic agency.
Wealthy historic districts (Upper East Side, Tribeca, Carnegie Hill)
have used preservation societies, community boards, and federal-level
petitions (Congressman Nadler / FCC, NHPA &sect;106) to stall Link5G
installations. Mandated outer-borough districts have no comparable
mechanism for institutional resistance.

The deepest regulatory failure is jurisdictional. The 2020 NYC POST Act
requires the NYPD to publish Impact &amp; Use Policies for roughly forty
surveillance technologies &mdash; including WiFi Geolocation Tracking
Devices, the very capability LinkNYC operationalises at scale. NYPD's
own use of that capability requires probable cause, a court order, and
records no data; LinkNYC's parallel use requires nothing, runs continuously,
and retained identifiable data for years. Because LinkNYC is privately
owned by the CityBridge consortium rather than the NYPD, no IUP for
smart kiosks exists. The infrastructure is a transparency loophole:
data is collected outside POST Act oversight, then voluntarily routed
into systems that fall within it.

Closing this gap requires the Digital Fairness Act's affirmative-consent
regime, meaningful enforcement of the POST Act's disclosure floor, and
decoupling fundamental public utilities from the mechanics of surveillance
capitalism.

## Methodology &amp; disclosures

A more detailed methodology block lives in the footer of the infographic
itself, including the full list of data sources, visualization choices,
and disclosure of which figures are hardcoded versus pulled live.
