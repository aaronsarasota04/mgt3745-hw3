const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function makeElement() {
  return {
    value: '',
    textContent: '',
    hidden: false,
    children: [],
    replaceChildren() {
      this.children = [];
    },
    append(child) {
      this.children.push(child);
    },
    addEventListener(event, handler) {
      this[event] = handler;
    }
  };
}

function loadApp(storage = {}) {
  const elements = {};
  const ids = [
    'skills-input',
    'job-input',
    'evaluate-button',
    'status-message',
    'result-card',
    'target-role',
    'match-score',
    'match-summary',
    'matched-list',
    'missing-list'
  ];

  for (const id of ids) {
    elements[id] = makeElement();
  }

  elements['result-card'].hidden = true;

  const document = {
    querySelector(selector) {
      if (selector.startsWith('#')) {
        return elements[selector.slice(1)];
      }
      return null;
    },
    createElement() {
      return makeElement();
    }
  };

  const context = {
    window: {
      localStorage: {
        getItem(key) {
          return Object.prototype.hasOwnProperty.call(storage, key) ? storage[key] : null;
        },
        setItem(key, value) {
          storage[key] = String(value);
        }
      }
    },
    document,
    console
  };

  vm.createContext(context);
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);

  return {
    elements,
    storage,
    clickEvaluate() {
      elements['evaluate-button'].click();
    }
  };
}

test('EARS 1: compares two normalized lists and computes a percentage match', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = 'Python, SQL, AWS';
  elements['job-input'].value = 'Python, SQL, ETL, AWS';

  clickEvaluate();

  assert.equal(elements['match-score'].textContent, '75%');
  assert.equal(elements['match-summary'].textContent, 'Strong fit. This role looks like a realistic match.');
  console.log('EARS 1 passed');
});

test('EARS 2: empty user or job list blocks the comparison', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = '';
  elements['job-input'].value = 'Python';
  clickEvaluate();
  assert.equal(elements['status-message'].textContent, 'Enter at least one skill you know before checking a role.');

  elements['skills-input'].value = 'Python';
  elements['job-input'].value = '';
  clickEvaluate();
  assert.equal(elements['status-message'].textContent, 'Add the job requirements to compare against your skills.');
  console.log('EARS 2 passed');
});

test('EARS 3: 100% match shows a full score and no missing skills', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = 'Python, SQL, AWS';
  elements['job-input'].value = 'Python, SQL, AWS';

  clickEvaluate();

  assert.equal(elements['match-score'].textContent, '100%');
  assert.equal(elements['missing-list'].children.length, 0);
  assert.equal(elements['match-summary'].textContent, 'Strong fit. This role looks like a realistic match.');
  console.log('EARS 3 passed');
});

test('EARS 4: 50% to 99% yields a potential-fit summary and a missing list', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = 'Python, SQL';
  elements['job-input'].value = 'Python, SQL, ETL, AWS';

  clickEvaluate();

  assert.equal(elements['match-score'].textContent, '50%');
  assert.equal(elements['match-summary'].textContent, 'Partial fit. A few tools are missing, but the role may still be worth pursuing.');
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'ETL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'AWS'));
  console.log('EARS 4 passed');
});

test('EARS 5: below 50% shows a weak-fit summary and missing skills', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = 'Python';
  elements['job-input'].value = 'Python, SQL, ETL, AWS';

  clickEvaluate();

  assert.equal(elements['match-score'].textContent, '25%');
  assert.equal(elements['match-summary'].textContent, 'Weak fit. The missing requirements are significant for this role.');
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'SQL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'ETL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'AWS'));
  console.log('EARS 5 passed');
});

test('EARS 6: matched and missing skills are rendered in separate lists for review', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = 'Python, SQL';
  elements['job-input'].value = 'Python, SQL, ETL';

  clickEvaluate();

  assert.ok(elements['matched-list'].children.some(item => item.textContent === 'Python'));
  assert.ok(elements['matched-list'].children.some(item => item.textContent === 'SQL'));
  assert.ok(elements['missing-list'].children.some(item => item.textContent === 'ETL'));
  assert.notEqual(elements['matched-list'].children.length, 0);
  assert.notEqual(elements['missing-list'].children.length, 0);
  console.log('EARS 6 passed');
});

test('EARS 7: blank items and duplicate values are ignored after normalization', () => {
  const { elements, clickEvaluate } = loadApp();

  elements['skills-input'].value = 'Python, , SQL, Python';
  elements['job-input'].value = 'Python, SQL, SQL';

  clickEvaluate();

  assert.equal(elements['match-score'].textContent, '100%');
  assert.equal(elements['missing-list'].children.length, 0);
  console.log('EARS 7 passed');
});

test('EARS 8: saved skill lists survive a page reload after comparison', () => {
  const firstLoad = loadApp();

  firstLoad.elements['skills-input'].value = 'Python, Java, Go, Rust';
  firstLoad.elements['job-input'].value = 'Python, Go, Databricks';
  firstLoad.clickEvaluate();

  assert.equal(firstLoad.elements['match-score'].textContent, '67%');

  const reloadedPage = loadApp(firstLoad.storage);

  assert.equal(reloadedPage.elements['skills-input'].value, 'Python, Java, Go, Rust');
  assert.equal(reloadedPage.elements['job-input'].value, 'Python, Go, Databricks');
  console.log('EARS 8 passed');
});
