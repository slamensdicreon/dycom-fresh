# Assessment of Dycom SuccessFactors Recruiting XML Feed vs\. API for Public Careers Experience

# SuccessFactors Recruiting API & XML Feed Assessment

## 1. Executive Summary

The purpose of this assessment is to understand whether the current **Dycom SuccessFactors/RMK XML job feed** provides sufficient structured data to support a robust public careers experience, or whether direct access to the **SuccessFactors Recruiting APIs** would provide additional candidate-facing value.

The assessment indicates that the current XML feed already provides a substantial amount of structured job information. This includes job identity, location, operating company/brand information, business unit, department, employment type, travel requirements, market, multiple locations, job description, and date information. 

SuccessFactors Recruiting APIs expose a significantly broader set of data. However, much of that additional information supports internal recruiting processes such as candidate management, applications, interviews, assessments, offers, and approvals rather than public job discovery. 

The assessment therefore focuses on three questions:

- What information is already available through the XML feed?
- What additional candidate-facing information could potentially be exposed through the XML?
- What meaningful public-careers information is available through the API that cannot reasonably be provided through the XML?

The current findings do **not indicate a clear data-completeness requirement for direct OData API access solely to support job listing, job detail, and public job search**. 

---

# 2. Objective and Scope

This assessment reviews the SuccessFactors Recruiting data landscape from the perspective of the **public careers experience**.

The analysis considers three primary capabilities:

| Capability | Objective |
| --- | --- |
| **Job Listing** | Provide enough structured information for candidates to quickly understand and evaluate jobs from search results. |
| **Job Detail** | Provide complete job information needed for candidates to understand an opportunity. |
| **Search, Filter & Sort** | Provide structured attributes that allow candidates to efficiently discover relevant jobs. |

The SuccessFactors Recruiting APIs also expose candidate and recruiting-process information. Those capabilities are included to provide a complete view of the API landscape, but are distinguished from information appropriate for a public careers experience.

---

# 3. Current Dycom XML Feed: What Is Available

The current XML feed contains considerably more structured information than a basic job feed containing only title, description, and location.

A representative feed record contains the following populated fields. 

| XML Field | Example | Business Meaning | Potential Public Use |
| --- | --- | --- | --- |
| `title` | Travel Laborer Telecom Underground | Job title | Listing, Detail, Search |
| `created` | 23 Jul 2026 | Job record date | Listing, Sort/Recency |
| `url` | Public job URL | Job destination | Listing |
| `city` | Chattanooga | City | Listing, Search/Filter |
| `state` | TN | State | Listing, Search/Filter |
| `postalcode` | 37406 | ZIP code | Search/Location |
| `country` | US | Country | Search/Filter |
| `location` | Chattanooga, TN, US, 37406 | Display location | Listing, Detail, Search |
| `multilocation` | Multiple Chattanooga locations | Additional job locations | Detail, Search |
| `businessunit` | Operations | Business classification | Search/Filter |
| `department` | Underground Labor | Job/category classification | Listing, Detail, Search |
| `facility` | Star Construction, LLC | Company/OpCo-related value | Listing, Detail, Search |
| `ID` | 12769-en\_US | Unique job identifier | System/Search |
| `shifttype` | Hourly | Job/employment classification | Listing, Detail, Filter |
| `locale` | en\_US | Language/locale | Localization |
| `travel` | 50%–74% | Travel requirement | Detail, Filter |
| `description` | Full HTML description | Complete job content | Detail, Keyword Search |
| `brand` | star | Brand identifier | Listing/Filter |
| `majormarket` | Chattanooga | Geographic market | Search/Filter |

This provides a strong structured foundation for the public careers experience.

---

# 4. Additional Fields Already Present in the XML Structure

The feed structure also includes additional fields that are empty in the representative job record.

An empty value for a particular job should **not** be interpreted as meaning that the field is unavailable across the entire feed. Population may vary by requisition and should be validated across the broader job inventory. 

| XML Field | Current Sample | Potential Business Meaning |
| --- | --- | --- |
| `jobtype` | Empty | Job classification |
| `dept` | Empty | Department/specialization |
| `adcode` | Empty | Additional classification/filtering |
| `compensation` | Empty | Compensation information |
| `recruiterid` | Empty | Recruiter information |
| `clientcustomer` | Empty | Customer/client information, depending on configuration |
| `customfield3–5` | Empty | Additional configured attributes |
| `certification` | Empty | Certification requirements |
| `degree` | Empty | Degree requirements |
| `education` | Empty | Education requirements |
| `productservice` | Empty | Product/service classification |
| `experience` | Empty | Experience requirements |
| `campaigncode` | Empty | Campaign attribution |
| `posteddate` | Empty | Job posting date |
| `shift` | Empty | Shift/full-time/part-time classification |
| `segments` | Empty | Additional job segmentation |
| `secondarymarket` | Empty | Secondary geographic market |

The XML therefore already has schema capacity for several additional candidate-facing attributes. 

### Important Finding

The structured fields:

`education`  
`degree`  
`experience`

are empty in the sample.

However, the underlying information is **not actually absent**. It exists within the description.

---

# 5. Information Available Within the Description

The reviewed job description contains multiple distinct candidate-facing information types.

## Information identified in the description

| Information | Example | Public Value | Structured Separately? |
| --- | --- | --- | --- |
| **Company context** | Star Construction, LLC | High | Related value also available through `facility`/`brand` |
| **Job discipline** | Telecom Underground | High | Partially represented by `department` |
| **Travel** | Travel is required | High | **Yes **`travel` |
| **Benefits** | PTO, insurance, 401(k), stock purchase, etc. | High for detail | Not identified as a separate populated field |
| **Responsibilities** | Install underground telecommunications cabling | High | No |
| **Skills/activities** | Digging, cabling, equipment operation | High | No dedicated structured skill field identified |
| **Minimum age** | 18+ | Detail | No |
| **Work authorization** | U.S. authorization required | Detail | No |
| **Education** | High School Diploma/GED or relevant experience | High | `education`/`degree` nodes exist but are empty in sample |
| **Experience** | Hand tools and utility-truck experience preferred | High | `experience` node exists but is empty in sample |
| **Equipment knowledge** | Hand tools, utility trucks, heavy machinery | Useful | No dedicated field identified |
| **Physical requirements** | Lift up to 55 lbs; heights; crawl spaces | Important detail | No dedicated field identified |
| **Work environment** | All-weather work; remote locations | Useful | No dedicated field identified |
| **Training** | Hands-on training | Detail/employer value proposition | No |
| **Safety** | Safety-first culture | Detail/employer value proposition | No |
| **EEO content** | Equal-opportunity statement | Job detail | No |

---

# 6. How the Current XML Supports Job Listing

The existing feed already provides the core information needed to create informative job-result cards.

### Currently Available

A listing experience could use:

- Job title
- Location
- City and state
- Company/OpCo-related value
- Brand
- Business unit
- Department/job category
- Employment type
- Created date
- Travel requirement, where useful

These fields are already present in the current feed. 

### Example

A candidate-facing result could conceptually present:

**Travel Laborer – Telecom Underground**  
Star Construction, LLC  
Chattanooga, TN  
Underground Labor | Hourly  
50%–74% Travel

The underlying XML already provides the structured information needed to assemble this type of listing.

---

# 7. How the Current XML Supports Job Detail

The XML contains a full HTML job description, not just a short summary.

The description can contain:

- Role introduction
- Benefits
- Responsibilities
- Qualifications
- Physical requirements
- Employer information
- Equal employment opportunity information

Structured XML fields can supplement this content with information such as company/OpCo, department, business unit, employment type, travel requirement, and multiple job locations. 

This means the current feed already supports a comprehensive job-detail experience.

---

# 8. How the Current XML Supports Search, Filtering and Sorting

The XML also contains enough structured information to support a substantial faceted search experience.

| Candidate Search Need | XML Source |
| --- | --- |
| **Keyword** | `title`, `description` |
| **Job Category** | `department` |
| **Business Area** | `businessunit` |
| **Company / OpCo** | `facility` |
| **Brand** | `brand` |
| **City** | `city` |
| **State** | `state` |
| **ZIP** | `postalcode` |
| **Country** | `country` |
| **Location** | `location` |
| **Multiple Locations** | `multilocation` |
| **Major Market** | `majormarket` |
| **Employment / Job Type** | `shifttype` |
| **Travel** | `travel` |
| **Date / Recency** | `created` |

The current XML therefore provides the underlying data necessary for keyword search plus multiple structured filters. 

---

# 9. Structured vs. Unstructured Data for Search

The difference has practical implications.

### Structured data

Example:

`travel = 50%–74%`

Can support:

- A Travel filter
- Display on a result card
- Sorting/grouping if desired
- Consistent analytics

### Unstructured data

Example:

> “Previous experience safely operating various hand tools and utility trucks is preferred.”

Can support:

- Keyword search for “utility truck”
- Keyword search for “hand tools”
- Job-detail content

But it does not reliably support:

- “1–3 years experience” filter
- “Equipment Experience” facet
- Standardized experience comparisons across jobs

### Key Principle

> **Full-text search can use unstructured description content, while consistent facets and filters generally benefit from structured fields.**

---

# 10. SuccessFactors Recruiting API Landscape

SuccessFactors Recruiting APIs provide access to a much broader recruiting data model.

For client consumption, the APIs are easier to understand when grouped by business purpose.

## Public Job Content

| API / Entity | Purpose | Public Careers Relevance |
| --- | --- | --- |
| **JobRequisition** | Provides standard, system, and configured requisition attributes | **Very High** |
| **JobRequisitionLocale** | Provides localized titles, descriptions, headers, footers, locale, and posting information | **Very High** |

## Application Configuration

| API / Entity | Purpose | Public Careers Relevance |
| --- | --- | --- |
| **JobReqScreeningQuestion** | Questions associated with a job requisition | Primarily application-stage |
| **JobReqScreeningQuestionChoice** | Available responses to screening questions | Primarily application-stage |

## Candidate & Application Management

| API / Entity | Purpose | Public Careers Relevance |
| --- | --- | --- |
| **Candidate** | Candidate profile, resume, attachments, and configured candidate fields | Internal / Not Public |
| **CandidateBackground** | Candidate employment, education, and background information | Internal / Not Public |
| **JobApplication** | Candidate application, source, status, dates, and application attributes | Internal / Not Public |
| **JobApplicationStatus** | Application workflow/status | Internal |
| **JobApplicationQuestionResponse** | Candidate responses to application questions | Internal / Not Public |
| **JobApplicationComments** | Application/recruiter comments | Internal |

## Interviews, Assessments & Offers

| API / Entity | Purpose | Public Careers Relevance |
| --- | --- | --- |
| **JobApplicationInterview** | Interview information | Internal |
| **JobApplicationAssessmentOrder** | Candidate assessment information | Internal |
| **JobOffer** | Offer information | Internal |
| **JobOfferApprover** | Offer approval information | Internal |

## Administration

| API / Entity | Purpose | Public Careers Relevance |
| --- | --- | --- |
| **JobRequisitionGroupOperator** | Recruiting groups/operator relationships | Internal |
| **Field Control APIs** | Controls access to recruiting fields | Administration |
| **getRecruitingTemplate** | Recruiting template information | Administration |

The API landscape therefore provides significantly greater **breadth**, but much of that breadth relates to recruiting workflow rather than public job discovery. 

---

# 11. APIs Most Relevant to the Public Careers Experience

## JobRequisition

`JobRequisition` is the primary SuccessFactors API entity relevant to public job experiences.

Depending on Dycom's SuccessFactors configuration, it can contain:

- Standard requisition fields
- System fields
- Configured custom fields
- Picklist-backed fields
- Organizational attributes
- Job classifications
- Location information
- Relationships to localized content
- Recruiting/process information

The actual fields available depend on the active requisition templates and configuration; therefore, the API should not be viewed as a single universal schema containing the same fields for every SuccessFactors implementation. 

## JobRequisitionLocale

This entity provides localized candidate-facing job content, including:

| Field | Information |
| --- | --- |
| `externalTitle` | Candidate-facing title |
| `externalJobDescription` | Candidate-facing description |
| `extJobDescHeader` | External description header |
| `extJobDescFooter` | External description footer |
| `jobTitle` | Job title |
| `jobDescription` | Job description |
| `locale` | Language/locale |
| `status` | Posting status |
| `jobReqId` | Requisition ID |

For public careers, its primary value is localized title and description content. 

---

# 12. APIs Primarily Supporting Internal Recruiting Processes

A large portion of the SuccessFactors API landscape provides information that should be considered separately from public careers requirements.

Examples include:

- Candidate profiles
- Resumes and attachments
- Candidate background information
- Application responses
- Application status
- Interview information
- Assessment information
- Recruiter comments
- Candidate referrals
- Offer information
- Offer approvals
- Recruiting groups
- Security and field permissions

These capabilities demonstrate the breadth of SuccessFactors Recruiting APIs, but they do not represent additional data requirements for job listing, job detail, or public search. 

> **Key distinction:** API availability does not automatically mean that the information is appropriate or valuable for the public careers experience.

---

# 13. XML vs. API: Field-Level Comparison

| Data Point | Current XML Status | API Potential | Listing | Detail | Search / Filter | Assessment |
| --- | --- | --- | --- | --- | --- | --- |
| Job Title | **Structured** | Available | ✓ | ✓ | ✓ | XML supports requirement |
| Job ID | **Structured** | Available | — | — | ✓ | XML supports requirement |
| Job URL | **Structured** | Posting-related | ✓ | — | — | XML supports requirement |
| Created Date | **Structured** | Available | ✓ | — | ✓ | XML supports basic recency |
| Specific Posting Dates | `posteddate` exists but empty in sample | Available via posting data | ✓ | ✓ | ✓ | Validate business requirement |
| Description | **Structured container with rich unstructured content** | Available | — | ✓ | ✓ | XML supports detail/full-text search |
| City | **Structured** | Available | ✓ | ✓ | ✓ | XML supports requirement |
| State | **Structured** | Available | ✓ | ✓ | ✓ | XML supports requirement |
| ZIP | **Structured** | Available | — | Optional | ✓ | XML supports requirement |
| Country | **Structured** | Available | Optional | ✓ | ✓ | XML supports requirement |
| Multi-location | **Structured** | Potential | Optional | ✓ | ✓ | XML supports requirement |
| Business Unit | **Structured** | Configuration-dependent | Optional | Optional | ✓ | XML supports requirement |
| Department / Category | **Structured** | Configuration-dependent | ✓ | ✓ | ✓ | XML supports requirement |
| Facility / Company-related value | **Structured** | Configuration-dependent | ✓ | ✓ | ✓ | XML supports requirement |
| Brand | **Structured** | Configuration-dependent | Optional | Optional | ✓ | XML supports requirement |
| Job/Employment Type | **Structured in **`shifttype`** sample** | Configuration-dependent | ✓ | ✓ | ✓ | XML supports requirement |
| Travel | **Structured** and repeated in description | Configuration-dependent | Optional | ✓ | ✓ | XML supports requirement |
| Major Market | **Structured** | Configuration-dependent | Optional | Optional | ✓ | XML supports requirement |
| Experience | **Unstructured in description**; structured node exists but empty | Potential | Optional | ✓ | ✓ if structured | **XML enhancement opportunity** |
| Education | **Unstructured in description**; nodes exist but empty | Potential | — | ✓ | Potential | **XML enhancement opportunity** |
| Skills | **Unstructured in description** | Potential depending on source model | Optional | ✓ | ✓ if structured | **Potential enhancement** |
| Certification | Field exists; sample empty | Potential | Optional | ✓ | ✓ | Validate availability |
| Benefits | **Unstructured in description** | Configuration-dependent | Optional | ✓ | Limited | Current detail content may be sufficient |
| Physical Requirements | **Unstructured in description** | Not identified as dedicated feed field | — | ✓ | Limited | Primarily detail content |
| Work Environment | **Unstructured in description** | Potential/custom | Optional | ✓ | Potential | Structure only if business need exists |
| Compensation | Field exists; sample empty | Potential | ✓ | ✓ | ✓ | Validate availability/publication |
| Shift | Field exists; sample empty | Potential | ✓ | ✓ | ✓ | Validate availability |
| Secondary Market | Field exists; sample empty | Potential | — | Optional | ✓ | Validate population |
| Candidate Information | Not public feed data | API available | — | — | — | Internal |
| Applications | Not public feed data | API available | — | — | — | Internal |
| Interviews | Not public feed data | API available | — | — | — | Internal |
| Assessments | Not public feed data | API available | — | — | — | Internal |
| Offers | Not public feed data | API available | — | — | — | Internal |

The underlying source analysis shows that the API's largest increase in data breadth is primarily recruiting-process data rather than additional public-search information. 

---

# 14. Potential XML Enhancements

The strongest XML opportunities fall into two categories.

## A. Structure information that already exists in the description

This does **not** necessarily require obtaining new information.

| Information | Current State | Potential Enhancement | Why |
| --- | --- | --- | --- |
| **Experience** | Description contains experience requirements | Populate `experience` if structured source exists | Enables standardized experience filtering |
| **Education** | Description contains Diploma/GED requirement | Populate `education`/`degree` where appropriate | Enables structured qualification display/filtering |
| **Skills / Capabilities** | Cabling, digging, equipment operation, hand tools, etc. appear in description | Map to appropriate structured taxonomy/custom field if maintained upstream | Improves skill-based discovery |
| **Work Environment** | All-weather/remote-location information appears in description | Consider structured classification if consistent across roles | Could help distinguish field-oriented jobs |
| **Benefits** | Detailed benefits exist in description | Structure only if a consistent business use case exists | Could enable reusable/consistent benefit presentation |

### Important consideration

Structuring should occur at the **source-data level where possible**, rather than extracting values dynamically from prose.

For example, the fact that “High School Diploma” appears in a description does not automatically mean the site should infer and assign an Education facet. A standardized source value would provide greater consistency.

## B. Populate XML fields that already exist but are currently unpopulated in the sample

| XML Field | Potential Public Value | Recommended Validation |
| --- | --- | --- |
| `certification` | High for roles requiring CDL/technical credentials | Determine whether structured certification data exists |
| `experience` | High | Determine whether standardized experience values exist |
| `education` / `degree` | Medium–High | Determine whether structured qualification values exist |
| `shift` | High if consistently maintained | Confirm business definition and source |
| `compensation` | High | Confirm availability and public-display requirements |
| `posteddate` | High for recency | Determine relationship to `created` |
| `secondarymarket` | Useful for regional discovery | Check population across jobs |
| `segments` | Potentially high | Determine candidate-facing taxonomy meaning |
| `productservice` | Potential | Determine whether values are meaningful to candidates |
| `dept` | Potential | Determine whether it adds value beyond `department` |

---

# 15. Custom Field Opportunity

The XML structure also contains five custom fields.

In the representative record:

- `customfield1` – populated with recruiter information
- `customfield2` – populated with recruiter information
- `customfield3` – empty
- `customfield4` – empty
- `customfield5` – empty

The available custom-field structure may provide additional capacity for attributes that do not align with existing standard XML fields. 

Potential candidate-facing examples could include:

- Career level
- Work environment/type
- Skill or discipline
- Candidate-facing job family

However, custom fields should only be considered where:

1. Structured source data exists.
2. The field has consistent business meaning across requisitions.
3. The value improves candidate discovery.
4. Existing downstream dependencies are understood.

SAP notes that repurposing fields can have downstream consequences, so mappings should be validated before changing existing usage.

---

# 16. Data That Should Remain Internal

SuccessFactors APIs expose significantly more information than is appropriate for public careers.

The following should remain outside the public search/job dataset unless a separate authorized recruiting use case requires them:

- Candidate profiles
- Resumes
- Candidate background information
- Application responses
- Application statuses
- Interview information
- Assessment information
- Background-check information
- Recruiter comments
- Referral information
- Offer details
- Offer approvals
- Recruiting teams/operators
- Security and field permissions

This distinction is important:

> **Greater API data breadth does not automatically provide greater public-careers value.**

---

# 17. Search Architecture Considerations

The current feed supports two complementary search approaches.

## Structured / Faceted Search

Uses dedicated attributes such as:

- City
- State
- ZIP
- Brand
- Facility/company
- Business unit
- Department
- Major market
- Job/employment type
- Travel

These provide predictable facets and filters.

## Full-Text Search

Uses:

- Title
- Description

This makes information such as skills, responsibilities, education terms, experience requirements, and equipment terminology discoverable even when those concepts are not separate XML attributes.

SAP confirms that RMK's search index includes both structured fields and the description payload.

### Practical implication

A robust search experience does **not require every piece of job information to become a facet**.

For example:

- “fiber”
- “cabling”
- “hand tools”
- “GED”
- “heavy machinery”

may already be discoverable through full-text indexing of the description.

A structured field becomes more valuable when the requirement is:

> “Show all jobs with this standardized attribute and allow the candidate to explicitly filter by it.”

---

# 8. XML vs API Architectural Framing

You can evaluate the decision in four layers.

### Layer 1: Currently Structured in XML

Immediately usable for listing, detail, filters, facets, and search.

Examples:

**Title · City · State · ZIP · Country · Location · Multi-location · Business Unit · Department · Facility · Brand · Job Type · Travel · Major Market · Date**

### Layer 2: Available as Unstructured Description Content

Already usable for job detail and keyword search.

Examples:

**Responsibilities · Skills/tasks · Education · Experience · Benefits · Physical Requirements · Work Environment**

### Layer 3: XML Enhancement Opportunity

Structured information exists or can be maintained upstream and can reasonably be mapped into an XML field.

Examples may include:

**Experience · Education · Certification · Shift · Compensation · Posting Date · Additional Taxonomy**

### Layer 4: API-Advantaged Requirement

A required candidate-facing attribute exists as structured SuccessFactors data but cannot reasonably be supplied through the XML.

This is where direct OData access becomes materially relevant.

---

# 19. Key Considerations

### 1. The XML is already a rich search source

The current feed should not be characterized as a simple title-description-location feed.

It already contains multiple candidate-facing structured attributes.

### 2. The description adds another layer of information

Some apparently “missing” attributes are actually available, but only as unstructured content.

### 3. Not every description concept needs to become structured

Responsibilities, physical requirements, benefits, and similar content may be perfectly appropriate as job-detail/full-text content.

Add structure only where it provides a clear candidate or business benefit.

### 4. Empty XML nodes require validation

An empty `experience` or `compensation` field in one job does not establish that the field is unavailable across the feed.

### 5. Field semantics should be validated

SAP's generic definitions and Dycom's current mappings may not always mean exactly the same thing. For example, SAP documents `facility` as a facility/location-oriented field, while the reviewed Dycom record contains `Star Construction, LLC`. [SAP Support Portal](https://userapps.support.sap.com/sap/support/knowledge/E/3425858?utm_source=chatgpt.com)

Therefore, client-facing labels should reflect the **actual Dycom mapping**, not simply the XML node name.

### 6. Feed behavior should be considered operationally

SAP notes that incoming feed data is compared with existing RMK job data and that changes to mapped fields can trigger job updates. [SAP Support Portal](https://userapps.support.sap.com/sap/support/knowledge/en/2629840?utm_source=chatgpt.com)

Any XML enhancement should therefore consider downstream feed and indexing behavior, not only the front-end display.

---

# 20. Findings and Conclusion

The current Dycom XML feed already provides a strong structured foundation for public careers:

> **Job Title + Description + Date + Facility/Company-related value + Brand + Business Unit + Department + City + State + ZIP + Country + Location + Multiple Locations + Major Market + Job/Employment Type + Travel + ID + URL**

The description further provides:

> **Responsibilities + Qualifications + Education + Experience + Skills/Activities + Benefits + Physical Requirements + Work Environment + Training/Career Messaging + EEO Content**

This changes how we should interpret potential gaps.

For example:

> **Education and experience are not absent from the feed. They are available within the description but are not populated as structured attributes in the reviewed record.**

The strongest near-term opportunity is therefore to determine which candidate-facing information needs to be **structured**, rather than simply identifying additional information that an API can expose.

## Overall Assessment

Based on the reviewed requirements and current XML structure, there is **no clear data-completeness requirement for direct SuccessFactors OData integration solely to support job listing, job detail, keyword search, and robust public filtering**.

The evaluation can instead proceed in this order:

1. **Use existing structured XML fields**  
for core listing, facets, filters, location search, and sorting.
2. **Use the description for full-text search and job-detail content**  
including responsibilities, qualifications, skills, education, experience, benefits, and physical requirements.
3. **Identify candidate experiences that specifically require structured data**  
such as experience-level filtering, certification filtering, shift filtering, or compensation.
4. **Determine whether those attributes already exist as structured SuccessFactors data and can be mapped into the XML.**

1. **Consider direct API access where a required candidate-facing attribute cannot reasonably be provided through the feed.**

This creates a more precise decision framework:

> **The API should be evaluated based on specific unresolved data requirements—not simply because it exposes a broader SuccessFactors data model.**

SAP also characterizes OData as most appropriate for frequent or real-time requests for smaller amounts of data, while larger data transfers are better suited to batch approaches. That distinction should be considered alongside data requirements when evaluating the final integration architecture.
