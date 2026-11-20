/**
 * Template notes for Dycom's marketing and communications leaders: what each page does, the story
 * it tells (shown with one example page), and what Dycom provides. Plain language — no
 * requirement IDs, component codes or build notes. These replace the working notes from the
 * design canvas in story mode and the library; the canvas keeps the working detail for the build
 * team, and the building blocks list under each template stays technical.
 *
 * Story beats use "Hero:", "01 …" and "Closing:" so they render as a numbered sequence.
 */
export type AudienceNotes = { does: string; example: string; story: string; fromDycom: string[] };

export const templateNotes: Record<string, AudienceNotes> = {
  T01: {
    does:
      'The front door, and Dycom’s argument in a single page: Dycom is the people connecting America, its strength is that it is local everywhere, here is the company near you, here is how the work gets done — tell us what you need.\n\n' +
      '1. Lead with the idea: Scale is Local.\n2. Route the four biggest reasons people come: careers, customers, investors, communities.\n3. Make “local” real: the map and directory of operating companies sit at the centre.\n4. End with one simple question: what brings you here?',
    example: 'The homepage',
    story:
      'Hero: a silent film of Dycom crews, “Scale is Local”, and one sentence in Dycom’s words.\n' +
      '01 Four front doors: Career Seekers, Customers, Investors, Communities.\n' +
      '02 Who we are and what we build, with the headline facts.\n' +
      '03 Our people at work: the brand film.\n' +
      '04 Our companies: the map, search by city or ZIP, and each company led by its own logo.\n' +
      '05 The four strengths, then the brand statement.\n' +
      '06 Expertise for the entire lifecycle: five stages, from design to restoration.\n' +
      'Closing: “Let’s get to work” — one form for every kind of visitor.',
    fromDycom: [
      'The brand statement — a line from Dycom’s company description stands in today.',
      'Search and sharing descriptions for the homepage.',
      'The official headline facts, and who owns them.',
      '“Over 500 field offices” in the copy while the map shows 39 home offices: new locations, or new wording.',
      'Names for lifecycle stages 4 and 5, which read as near-duplicates.',
      'Which held-back homepage sections return once the interior pages exist.',
    ],
  },
  T02: {
    does:
      'The investor’s front door, and the layout every other page inherits. Analysts and shareholders usually arrive after a results release. The same layout also carries stock information, governance, board committees, analyst coverage, shareholder services and FAQs.\n\n' +
      '1. Open on the latest results.\n2. Keep the call replay one click away — and always in the menu.\n3. Show what’s coming up and what was said.\n4. Reach every investor page from one Investor resources block.\n5. Keep investors on dycomind.com.',
    example: 'Investors overview',
    story:
      'Hero: the company in one paragraph, and the NYSE: DY listing.\n' +
      '01 Latest financial results: three headline figures, the results documents and the call replay.\n' +
      '02 The brand film, after the numbers.\n' +
      '03 Events — upcoming and past — beside investor news.\n' +
      '04 Featured reports.\n' +
      '05 Investor resources: filings, governance and shareholder resources.\n' +
      'Closing: email alerts and Investor Relations.\n\n' +
      'For two weeks after each results release, a banner above every page links to the release and the call replay.',
    fromDycom: [
      'A new introduction paragraph for the page.',
      'A decision on a fuller results snapshot, including the share price.',
      'Call transcripts as web pages rather than PDFs, from Notified.',
      'Tracking on the governance links, so Dycom can trim them based on real use.',
    ],
  },
  T03: {
    does:
      'When someone opens Who we are or What we do, they have chosen a topic, not a page. The landing confirms where they are, tells the section’s story in a few beats, and shows every page inside it.\n\n' +
      '1. Answer “what is this section?” in one sentence.\n2. Tell the story in Dycom’s voice.\n3. Show every page in the section, grouped as the menu groups them.\n4. Back it up with the headline facts.\n5. Close with one next step.',
    example: 'Who we are',
    story:
      'Hero: who Dycom is, in one sentence — incorporated 1969, NYSE: DY.\n' +
      '01 Purpose: to connect America, and the six values, stated once.\n' +
      '02 Explore: every page in the section.\n' +
      '03 How we work: Headway® safety and Rightway™ quality.\n' +
      '04 By the numbers: the headline facts.\n' +
      '05 Connection with Intention: Safety, People, Our Reach.\n' +
      '06 Latest news.\n' +
      'Closing: find the company near you.\n\n' +
      'What we do uses the same page with different sections: the five-stage lifecycle, who we build for, and a preview of the company directory.',
    fromDycom: [
      'A one-line description for each of the six values.',
      'Approval of the “Connection with Intention” wording, now written once for every page.',
      'Photos and biographies for the leadership pages.',
      'The official headline facts.',
      'Whether electrical contracting gets its own service page.',
    ],
  },
  T04: {
    does:
      'One topic, told fully — a page people read rather than scan. Nineteen pages use it, from values, safety and sustainability to the trades, veterans and benefits.\n\n' +
      '1. Say what the topic is in one sentence.\n2. Make a long page easy to move around, with an “On this page” list.\n3. Use the right mix of blocks for the topic.\n4. End on related pages and one next step.',
    example: 'Headway® safety',
    story:
      'Hero: what Headway® is, and the fact that defines it — anyone can stop the work.\n' +
      '01 Safety before schedule: four commitments.\n' +
      '02 Before work starts: the job-task assessment, in four steps.\n' +
      '03 Training and mentoring.\n' +
      '04 Hazard recognition guides, in English and Spanish.\n' +
      '05 Stop-work authority, stated plainly.\n' +
      '06 Safety resources for crews, customers and communities, including 811.\n' +
      'Closing: find open roles.',
    fromDycom: [
      'Confirmation of the four job-task assessment steps against Headway®.',
      'How training and mentoring work in practice.',
      'The current hazard-recognition guides.',
      'Sustainability: the latest report, and whether the story has three pillars or four.',
    ],
  },
  T05: {
    does:
      'A customer or candidate wants to know: do you do this work, who does it near me, and could I work in it? One page per service — deep where Dycom has a lot to say, shorter where it doesn’t.\n\n' +
      '1. Explain the service in Dycom’s lifecycle language.\n2. Show what Dycom builds.\n3. Name the operating companies that do this work.\n4. Point to the trades and open roles in this service.',
    example: 'Wireline construction',
    story:
      'Hero: what the service is, and where it sits in the five-stage lifecycle.\n' +
      '01 What we build: four capabilities, with Dycom’s pictograms.\n' +
      '02 In the field: video of the work.\n' +
      '03 Our wireline companies: the directory, showing only the companies that do this work.\n' +
      '04 Careers: the trades in this service, and how many roles are open.\n' +
      'Closing: related services, then contact.\n\n' +
      'A shorter service, like Project management, simply leaves sections out.',
    fromDycom: [
      'Which services each operating company offers — the companies section depends on it.',
      'How recruiting departments map to trades, for live open-role counts.',
      'Two new pictograms, for aerial and splicing work.',
      'The video from today’s wireline page.',
      'How Building Systems and electrical contracting will be presented.',
    ],
  },
  T06: {
    does:
      'Someone wants the Dycom company in their area, or one they have heard of. This is the map as a full page.\n\n' +
      '1. Explain the model: local names, one national group.\n2. Search by place or name; narrow by company, service or state.\n3. Show each company with its own logo, and send visitors to its own website and careers page.\n4. List every company A–Z, so the page works even without the map.',
    example: 'Our companies',
    story:
      'Hero: local employers, one national group — about 40 companies.\n' +
      '01 Find a company: search, filters, “Use my location”, the map and the company card.\n' +
      '02 All companies A–Z, with their logos.\n' +
      'Closing: not sure which company to call?\n\n' +
      'On phones the map steps aside and the list does the work.',
    fromDycom: [
      'Which services each company offers, for the service filter.',
      'The states each company serves.',
      'Field office locations, so the map matches “over 500 field offices”.',
      'How many companies to state: “about 40” in the copy, 38 listed while one is held back.',
    ],
  },
  T07: {
    does:
      'The front door for every candidate — most of whom don’t know Dycom’s job titles.\n\n' +
      '1. Search first: role, then location.\n2. Answer “where do I fit?” in plain-language trades.\n3. Show what working here is really like.\n4. Build trust with guidance on recruitment fraud.\n5. Never a dead end: the talent network.',
    example: 'Careers',
    story:
      'Hero: skilled work with a local employer, with job search up front.\n' +
      '01 Where do I fit? Eight trades, each explained in a line, with open-role counts.\n' +
      '02 Life at Dycom: employee videos, led by the brand film.\n' +
      '03 Benefits, one category at a time.\n' +
      '04 Why Dycom: a local employer, trained on the job, room to grow — with Veterans and Students.\n' +
      '05 Apply safely.\n' +
      'Closing: join the talent network.',
    fromDycom: [
      'Benefit categories and copy.',
      'Employee story videos.',
      'Approval of the recruitment-fraud guidance.',
      'Confirmation that “room to grow” and “trained on the job” match Dycom’s career story.',
      'Live open-role counts from recruiting.',
    ],
  },
  T08: {
    does:
      'Search the way job seekers do — role and location first — with filters in plain language, an honest count of results, and never a dead end.',
    example: 'Fiber splicing in Georgia',
    story:
      'Hero: open roles, with the search already filled in.\n' +
      '01 Filters with counts: trade, company, state, job type, travel.\n' +
      '02 Results: the role, the company and its logo, location, job type, travel and date posted — and pay, when recruiting provides it.\n' +
      'Closing: the talent network, and a way to search the rest of the site.\n\n' +
      'When nothing matches, the page says so, suggests the right trade (“cable splicer” → fiber splicing), widens the search and shows the nearest similar roles.',
    fromDycom: [
      'Pay information from recruiting, so it can appear on every role.',
      'Whether remote or hybrid roles exist, and how they are marked.',
      'The everyday words candidates use for each trade.',
      'Each recruiting location matched to the right operating company.',
    ],
  },
  T09: {
    does:
      'One role, with everything a candidate needs to decide — and a clean, quick way to apply from a phone.\n\n' +
      '1. The facts that matter: location, job type, travel, schedule, pay.\n2. The employer, named and linked.\n3. A clear path to apply.\n4. Fraud guidance right where the decision happens.',
    example: 'Fiber splicer, CableCom',
    story:
      'Hero: the role, the company and its logo, location and date posted.\n' +
      '01 About the role: what you’ll do, what you bring, physical requirements, benefits.\n' +
      '02 A good question to ask in your interview.\n' +
      '03 About the company, and more roles there.\n' +
      'Alongside: “Apply on the company’s careers site”, with the key facts.\n' +
      'Closing: similar roles.\n\n' +
      'When a role closes, the page says so and offers similar roles — never an error page.',
    fromDycom: [
      'Where “Apply” should take candidates.',
      'Fuller job details from recruiting: pay, schedule, physical requirements, benefits.',
      'How long it really takes to apply on a phone.',
      'How long closed roles stay visible.',
    ],
  },
  T10: {
    does:
      'Find one item in a growing archive. News, Investor news, Events & presentations and the Resource Center all use it.\n\n' +
      '1. Search.\n2. Narrow with filters, and see what is applied.\n3. Page through results.\n4. Never a dead end.',
    example: 'Investor news',
    story:
      'Hero: what the archive holds, and the latest results.\n' +
      '01 Search and filters: type, topic, year.\n' +
      '02 Results: date, title, a short summary, type and topic.\n' +
      'Closing: email alerts or Investor Relations.\n\n' +
      'Events & presentations becomes a timeline: upcoming and past events, each with its webcast and materials.',
    fromDycom: [
      'Topics for news (Icreon drafts them for approval).',
      'How far back the archive goes.',
      'Whether releases come with short summaries.',
      'The decision on investor content living on dycomind.com.',
    ],
  },
  T11: {
    does:
      'Read one release or article in full, trust it, and act on it.\n\n' +
      '1. Show the text exactly as issued.\n2. Keep the related documents beside it.\n3. Lead on to related news.',
    example: 'Q2 2027 results release',
    story:
      'Hero: type and date, then the headline.\n' +
      '01 The opening paragraph and the three headline figures.\n' +
      '02 The release in full — outlook, results call and financial tables — exactly as issued.\n' +
      '03 About Dycom, and forward-looking statements.\n' +
      'Alongside: the results documents, Investor Relations contact, and sharing.\n' +
      'Closing: more investor news.',
    fromDycom: [
      'Releases delivered in full by the investor-relations provider.',
      'Investor Relations contact details.',
      'Whether financial tables arrive as tables or only as PDFs.',
      '“Telecommunications” rather than “telecom” in the boilerplate.',
    ],
  },
  T12: {
    does:
      'The right official document, fast. Seven libraries: annual and quarterly reports, SEC filings, governance documents, hazard recognition, the employee handbook and benefit plan disclosures.\n\n' +
      '1. Latest first.\n2. Filter by year and type.\n3. Say what each file is before it opens.\n4. Offer another format on request.',
    example: 'Annual reports',
    story:
      'Hero: what the library holds, and the next key date.\n' +
      '01 The latest reports, by cover.\n' +
      '02 Every document by year and type, with its size and date.\n' +
      '03 Need another format? Ask.\n' +
      'Closing: printed copies, or Investor Relations.',
    fromDycom: [
      'Report covers, if Dycom has them — photography stands in.',
      'How many years of reports to keep online.',
      'One library for annual reports and proxy statements, or two.',
    ],
  },
  T13: {
    does:
      'The way in for every question that isn’t a job application — six pages, one form that adapts to the question.\n\n' +
      '1. Point job seekers to open roles first.\n2. Ask who they are, then only what that question needs.\n3. Help them fix mistakes without losing what they typed.\n4. Confirm where their message went.',
    example: 'Contact',
    story:
      'Hero: Contact Dycom, with a pointer for job seekers.\n' +
      '01 Reach us: headquarters, Investor Relations, suppliers, and the company directory.\n' +
      '02 Send an inquiry: pick a topic, and the form asks only what that topic needs.\n\n' +
      'The same form handles subcontractor requests, the talent network, document requests and email alerts.',
    fromDycom: [
      'One public email address — today’s page shows two.',
      'Headquarters address, main phone and media contact.',
      'Who receives each kind of inquiry.',
      'A reply-time promise.',
      'Whether media and “other” stay separate topics.',
    ],
  },
  T14: {
    does:
      'Binding text that must stay exact, findable and printable: privacy, terms of use, and the two purchasing terms.\n\n' +
      '1. Show the last-updated date first.\n2. Jump to any numbered clause.\n3. Print cleanly.\n4. Never paraphrase — the text moves over word for word.',
    example: 'Privacy policy',
    story:
      'Hero: the policy and its date.\n' +
      '01 In this policy: every clause, with a Print button.\n' +
      '02 The clauses, word for word.\n' +
      'Closing: questions, Contact Dycom, and cookie preferences.',
    fromDycom: [
      'An update to the privacy policy — it still mentions Flash Player.',
      'A review of the terms of use, last updated in 2021.',
      'Confirmation that clause numbers carry over in the purchasing terms.',
      'The choice of cookie-consent tool.',
    ],
  },
  T15: {
    does:
      'Who leads Dycom, easy for every audience to find: leadership under Who we are, the board under Investors.\n\n' +
      '1. A face, a name and a title at a glance.\n2. A full biography without leaving the page.\n3. Executive officers and the board in one place.',
    example: 'Leadership',
    story:
      'Hero: Leadership, in one sentence.\n' +
      '01 Executive officers and the Board of directors, side by side as tabs.\n' +
      '02 Each person: portrait, name and title, with the biography one click away.\n' +
      'Closing: governance links, then open roles.',
    fromDycom: [
      'Names, titles, portraits and biographies.',
      'One consistent portrait shoot.',
      'Board committee memberships.',
    ],
  },
  T16: {
    does:
      'The pages nobody plans to visit — page not found, search results and confirmations — designed so no one hits a dead end.\n\n' +
      '1. Offer a way forward on every one.\n2. Keep site search and job search separate, but linked.\n3. Point job seekers to open roles from the page-not-found screen.',
    example: 'Page not found and search',
    story:
      'Page not found: one sentence, a way into job search, site search and popular pages.\n\n' +
      'Search: results by type — pages, documents, news — with a link to open roles when the search sounds like a job.\n\n' +
      'No results: why, what to try next, and popular pages. Confirmation pages share the forms’ thank-you design.',
    fromDycom: ['The popular pages to feature, revisited once analytics are in.', 'What site search should cover.'],
  },
};
