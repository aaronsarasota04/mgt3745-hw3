(() => {
  'use strict';

  // Keep saved drafts scoped to this feature and avoid accidental global variables.
  const storageKey = 'mgt3745.job-fit.v1';
  const userSkillsInput = document.querySelector('#skills-input');
  const jobInput = document.querySelector('#job-input');
  const linkedInInput = document.querySelector('#linkedin-url');
  const evaluateButton = document.querySelector('#evaluate-button');
  const statusMessage = document.querySelector('#status-message');
  const resultCard = document.querySelector('#result-card');
  const targetRole = document.querySelector('#target-role');
  const matchScore = document.querySelector('#match-score');
  const matchSummary = document.querySelector('#match-summary');
  const matchedList = document.querySelector('#matched-list');
  const missingList = document.querySelector('#missing-list');

  // Map common user-entered terms to stable labels used by the comparison result.
  const skillCatalog = [
    { label: 'Python', aliases: ['python', 'py'] },
    { label: 'JavaScript', aliases: ['javascript', 'js'] },
    { label: 'SQL', aliases: ['sql'] },
    { label: 'Java', aliases: ['java'] },
    { label: 'React', aliases: ['react'] },
    { label: 'Node.js', aliases: ['node.js', 'node', 'nodejs'] },
    { label: 'AWS', aliases: ['aws', 'amazon web services'] },
    { label: 'Docker', aliases: ['docker'] },
    { label: 'Kubernetes', aliases: ['kubernetes', 'k8s'] },
    { label: 'ETL', aliases: ['etl', 'extract transform load'] },
    { label: 'Spark', aliases: ['spark'] },
    { label: 'Git', aliases: ['git'] },
    { label: 'REST APIs', aliases: ['rest api', 'rest apis', 'api design'] },
    { label: 'Tableau', aliases: ['tableau'] },
    { label: 'Power BI', aliases: ['power bi', 'powerbi'] },
    { label: 'Excel', aliases: ['excel'] },
    { label: 'Machine Learning', aliases: ['machine learning', 'ml'] },
    { label: 'Statistics', aliases: ['statistics', 'statistical analysis'] },
    { label: 'Data Modeling', aliases: ['data modeling', 'data model'] },
    { label: 'Leadership', aliases: ['leadership', 'mentoring'] }
  ];

  const roleProfiles = {
    'software engineer': ['JavaScript', 'Python', 'SQL', 'Git', 'REST APIs', 'AWS', 'React', 'Node.js'],
    'data engineer': ['Python', 'SQL', 'ETL', 'Spark', 'AWS', 'Docker', 'Data Modeling', 'Git'],
    'data analyst': ['SQL', 'Excel', 'Python', 'Statistics', 'Tableau', 'Power BI', 'Data Modeling'],
    'backend engineer': ['Java', 'Python', 'SQL', 'REST APIs', 'AWS', 'Docker', 'Git'],
    'machine learning engineer': ['Python', 'SQL', 'Machine Learning', 'Statistics', 'AWS', 'Git']
  };

  // Normalize synonyms before comparison so common abbreviations count as the same skill.
  function normalizeSkill(value) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9+#\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function parseList(value) {
    return value
      .split(/[\n,]+/)
      .map(part => part.trim())
      .filter(Boolean);
  }

  // Convert each entered item to one canonical skill name without changing the input text.
  function canonicalSkillName(value) {
    const normalized = normalizeSkill(value);
    if (!normalized) {
      return value.trim();
    }

    for (const skill of skillCatalog) {
      if (skill.aliases.some(alias => normalizeSkill(alias) === normalized || normalized.includes(normalizeSkill(alias)))) {
        return skill.label;
      }
    }

    return value.trim();
  }

  function extractSkills(value) {
    const entries = parseList(value);
    const found = [];

    entries.forEach(entry => {
      const canonical = canonicalSkillName(entry);
      if (canonical && !found.includes(canonical)) {
        found.push(canonical);
      }
    });

    return found;
  }

  // Use role words in a supplied URL to select a fallback profile when requirements are absent.
  function inferRoleFromUrl(urlValue) {
    if (!urlValue) {
      return 'software engineer';
    }

    const cleaned = urlValue
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .replace(/\/$/, '');

    const combined = cleaned.split(/[^a-z0-9]+/).filter(Boolean).join(' ');

    if (combined.includes('data') && combined.includes('engineer')) {
      return 'data engineer';
    }
    if (combined.includes('data') && combined.includes('analyst')) {
      return 'data analyst';
    }
    if (combined.includes('backend')) {
      return 'backend engineer';
    }
    if (combined.includes('machine') && combined.includes('learning')) {
      return 'machine learning engineer';
    }
    if (combined.includes('engineer')) {
      return 'software engineer';
    }

    return 'software engineer';
  }

  function renderList(listNode, items) {
    listNode.replaceChildren();

    if (items.length === 0) {
      const item = document.createElement('li');
      item.textContent = 'No skill match yet.';
      listNode.append(item);
      return;
    }

    items.forEach(itemText => {
      const item = document.createElement('li');
      item.textContent = itemText;
      listNode.append(item);
    });
  }

  // Read and validate the last draft, falling back safely when storage is unavailable or corrupt.
  function loadState() {
    try {
      const storedText = window.localStorage.getItem(storageKey);
      if (storedText === null) {
        return { userSkills: '', jobText: '', linkedinUrl: '' };
      }

      const parsed = JSON.parse(storedText);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Unexpected stored data');
      }

      return {
        userSkills: typeof parsed.userSkills === 'string' ? parsed.userSkills : '',
        jobText: typeof parsed.jobText === 'string' ? parsed.jobText : '',
        linkedinUrl: typeof parsed.linkedinUrl === 'string' ? parsed.linkedinUrl : ''
      };
    } catch {
      statusMessage.textContent = 'Saved entries could not be read. Your current form values stay in place until you save again.';
      return { userSkills: '', jobText: '', linkedinUrl: '' };
    }
  }

  function saveState(nextState) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextState));
      return true;
    } catch {
      statusMessage.textContent = 'Could not save. Your typed values are still here and can be retried.';
      return false;
    }
  }

  // Validate both inputs, calculate the percentage, and update only the result view.
  function evaluateMatch() {
    const userSkills = extractSkills(userSkillsInput.value);
    const jobText = jobInput.value.trim();
    const urlText = linkedInInput.value.trim();

    if (!userSkills.length) {
      statusMessage.textContent = 'Enter at least one skill you know before checking a role.';
      resultCard.hidden = true;
      return;
    }

    if (!jobText && !urlText) {
      statusMessage.textContent = 'Add the job requirements or paste a LinkedIn URL to compare against your skills.';
      resultCard.hidden = true;
      return;
    }

    const roleName = inferRoleFromUrl(urlText);
    const jobRequirements = jobText
      ? extractSkills(jobText)
      : roleProfiles[roleName] || roleProfiles['software engineer'];

    const matchedSkills = jobRequirements.filter(skill =>
      userSkills.some(userSkill => normalizeSkill(userSkill) === normalizeSkill(skill))
    );
    const missingSkills = jobRequirements.filter(skill => !matchedSkills.includes(skill));
    const score = jobRequirements.length === 0
      ? 0
      : Math.round((matchedSkills.length / jobRequirements.length) * 100);

    const statusText = score >= 75
      ? 'Strong fit. This role looks like a realistic match.'
      : score >= 50
        ? 'Partial fit. A few tools are missing, but the role may still be worth pursuing.'
        : 'Weak fit. The missing requirements are significant for this role.';

    targetRole.textContent = roleName;
    matchScore.textContent = `${score}%`;
    matchSummary.textContent = statusText;
    renderList(matchedList, matchedSkills);
    renderList(missingList, missingSkills);
    resultCard.hidden = false;
    statusMessage.textContent = 'Match check complete.';

    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value,
      linkedinUrl: linkedInInput.value
    });
  }

  // Restore the draft before wiring autosave so a failed storage write never clears typed input.
  const savedState = loadState();
  userSkillsInput.value = savedState.userSkills;
  jobInput.value = savedState.jobText;
  linkedInInput.value = savedState.linkedinUrl;

  // Persist each field independently so a reload does not discard an in-progress comparison.
  userSkillsInput.addEventListener('input', () => {
    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value,
      linkedinUrl: linkedInInput.value
    });
  });

  jobInput.addEventListener('input', () => {
    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value,
      linkedinUrl: linkedInInput.value
    });
  });

  linkedInInput.addEventListener('input', () => {
    saveState({
      userSkills: userSkillsInput.value,
      jobText: jobInput.value,
      linkedinUrl: linkedInInput.value
    });
  });

  evaluateButton.addEventListener('click', evaluateMatch);
})();

