# Architecture

Status: ACTIVE in Module 3.

## Gate

Name hard constraints and three concrete options. Weights and scores use 1–5; a score of 5 always means most favorable. Define 1/3/5 anchors. Multiply weights by scores and sum. Record estimates and run one sensitivity check.

| Criterion | Weight | Hand-built option | Existing-service option | AI-assisted build |
|---|---:|---:|---:|---:|
| Cost to start |5 |1 |1 |4 |
| Cost to maintain |1 |3 |1 |4 |
| Time to working |4 |3 |1 |4 |
| Inspectability |5 |3 |1 |4 |
| Switching cost |1 |3 |1 |4 |
| Fit to spec |4 |3 |1 |5 |

## ADR-001

Title and date: Browser-based job-fit calculator built with AI assistance, 2026-09-13
Status: Accepted
Door / concrete acquisition and execution choice: Use a browser application that runs in the client, lets the user paste a résumé or enter a list of tools/technologies they know, and compares those skills against job requirements to calculate the percentage of requirements fulfilled. The application itself is not AI-driven; it is built using AI assistance during implementation.
Context: Feature 2 is a performance-class need: the product should help a student decide whether a role is worth pursuing when the posted requirements are only a partial match. The workflow should be transparent and user-controlled: the user supplies their résumé or qualifications, the job description lists required technologies and skills, and the app calculates how many requirements are covered. This keeps the decision grounded in evidence the user can inspect while still using AI assistance to accelerate implementation and improve clarity of the fit analysis.
Decision: We choose the AI-assisted build option. The weighted score is strongest overall: hand-built option scores 50, existing-service option scores 20, and AI-assisted build scores 84, with the largest advantages in cost to start, time to working, inspectability, and fit to spec. The 1/3/5 anchors were used consistently: 1 = least favorable, 3 = moderate, 5 = most favorable. We will build a browser-based app that compares user-entered skills or résumé evidence against job requirements and shows a percentage match, missing requirements, and a simple fit summary. The build process may use AI support, but the app itself remains a deterministic browser-based calculator.
Consequences and revisit trigger: The chosen architecture keeps the feature fast, inspectable, and easy to test in a classroom setting while aligning with the decision to build with AI assistance. It supports the real user need for a practical “requirements covered” assessment without needing a backend, private employer data, or a complex service. The tradeoff is that it remains a client-side evaluation tool, not a full recruiting intelligence platform. It does not guarantee an interview, a recruiter response, or movement to the next stage of the hiring process; it only helps the user assess fit and decide whether a role is worth pursuing. Revisit this ADR if the product must support multi-user storage, employer data integrations, richer weighting models, or backend analytics beyond the browser prototype.
