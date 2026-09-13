# Features and specification

## Kano-Classified Feature List

**Classification date:** 09/10/2026

| # | Feature | Kano class | Reason from research |
|---|---------|-----------|----------------------|
| 1 | Job is tech oriented | Must-be | The main need is a software/data engineering role, not a non-technical job. |
| 2 | Job requirements | Performance | Closer alignment between requirements and skills increases value; job descriptions are often preferred profiles, not strict checklists. |
| 3 | Recruiter/Hiring Manager information | Attractive | Helpful for outreach and visibility, but not required to evaluate a role. |
| 4 | Learning all technologies for a single job requirement | Indifferent | Candidates do not need to match every listed technology; partial fit can still be relevant. |
| 5 | Job offer | Must-be | Getting interviews and offers is the core purpose of the feature. |
| 6 | Salary | Performance | Better compensation makes a role more attractive, but the opportunity may still be worth pursuing if the fit is strong. |

---

## 1. Context

The primary user is a senior Computer Science student at Georgia Tech pursuing software engineering or data engineering roles across the United States. They are open to relocation and expect to graduate in December 2026, so they need to decide quickly which opportunities are worth applying to and which ones are likely to be a poor fit. The core challenge is evaluating whether a role is still worth pursuing when the posted requirements are only a partial match, while also finding openings that may not appear on major job boards.

---

## 2. Users

This feature is designed for early-career technical job seekers navigating competitive hiring pipelines. It reflects the experiences of a candidate who relied on projects and networking instead of internship experience, and a recruiter who evaluates candidates based on potential and fit rather than strict checklist compliance.

---

## 3. Scope

**This does:**
- Help the user decide whether a role is worth pursuing when the requirements are only a partial match.
- Find opportunities beyond major job boards, including company pages, alumni, and recruiter channels.
- Support decisions using projects, relevant experience, and network signals instead of rigid checklist thinking.

**This deliberately does not do:**
- Guarantee interviews or offers.
- Replace networking, portfolio work, or direct outreach.
- Treat every job description as equally relevant or every role as a good fit.

---

## 4. Behavior

- The user compares a role’s requirements against their background, including coursework, projects, relevant experience, and job-specific skills.
- If a role is not an exact match, the user can still assess whether it is worth pursuing when the core responsibilities, toolset, and growth potential are aligned.
- The user searches across multiple channels, not just major job boards, including company career pages, alumni networks, recruiter outreach, and other less visible sources.

---

## 5. Constraints

- The feature is for a student in the final semester before graduation, when application timing and volume matter.
- It should rely only on user-provided or public information, such as resume details, projects, and job descriptions.
- It should not require private employer data or internal hiring records.
- It must support multiple job-search channels rather than depending on one platform.

---

## 6. Acceptance

- WHEN the user reviews a job posting, THE SYSTEM SHALL compare the role’s requirements to the user’s skills, projects, and relevant experience.
- IF the role is only a partial match, THEN THE SYSTEM SHALL flag it as a potential fit and show which qualifications are missing or weak.
- THE SYSTEM SHALL evaluate opportunities from multiple sources, including job boards, company career pages, and networking channels, before recommending a role.
- WHILE the user is comparing roles, THE SYSTEM SHALL display a fit summary that separates must-have requirements from preferred qualifications.
- WHERE recruiter contact information is available, THE SYSTEM SHALL suggest a follow-up message based on the user’s qualifications and role fit.

---

## Handoff Test

*A competent stranger would still need to know which evidence sources are considered strong enough to justify applying to a role, and how the system should weigh factors such as project quality, recruiter connections, and experience gaps. This specification is based on two interviews and should be treated as a practical starting point rather than a fully validated model of hiring behavior.*

## Verification

| Criterion | Steps and input | Expected result | Observed result | Status | Evidence / commit |
|---|---|---|---|---|---|
| Your selected ID | Reproducible procedure | Before running | Actual observation | PASS / FAIL / CANNOT TEST / DEFERRED | Link |

Cover a normal action, relevant invalid input, and persistence or failure. Classify unselected requirements separately. Record actual outcomes; all-PASS is acceptable with evidence.
