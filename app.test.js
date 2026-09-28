const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const NOW = Date.parse('2026-09-18T12:00:00Z');

function loadApp(entries = [], now = NOW) {
  class FixedDate extends Date {
    constructor(...args) { super(...(args.length ? args : [now])); }
    static now() { return now; }
  }
  const elements = new Map();
  const document = {
    addEventListener() {},
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, { innerHTML: '', textContent: '' });
      return elements.get(id);
    },
  };
  const context = vm.createContext({ Date: FixedDate, URLSearchParams, URL, document, DEADLINES: entries });
  vm.runInContext(source, context, { filename: 'app.js' });
  return { app: context, elements };
}

function entry(overrides = {}) {
  return {
    name: 'Example 2027', full: 'Example Conference', category: 'Systems / Architecture',
    bk: 2, kiise: null, topTier: true, estimated: false,
    abstract: null, paper: null, tz: '', where: 'Example City', when: '2027',
    link: 'https://example.org/cfp', note: '', ...overrides,
  };
}

test('date-only deadlines preserve the published day without a countdown or calendar event', () => {
  const { app } = loadApp();
  for (const [paperDate, expected] of [['2026-09-18', 'Sep 18, 2026'], ['2026-10-01', 'Oct 1, 2026']]) {
    const e = entry({ paperDate });
    const html = app.cardHTML(e);
    assert.ok(html.includes(expected));
    assert.match(html, /Date only/);
    assert.match(html, /Time \/ timezone unconfirmed/);
    assert.doesNotMatch(html, /D-DAY|D-\d|ended|\+ Calendar|calendar\.google\.com/);
    assert.equal(app.gcalLink(e, app.targetOf(e)), null);
  }
});

test('unknown deadlines do not claim that an official announcement does not exist', () => {
  const { app } = loadApp();
  const html = app.cardHTML(entry());
  assert.match(html, /Deadline not confirmed/);
  assert.doesNotMatch(html, /Deadline not announced|Date only|\+ Calendar/);
});

test('date-only estimates show their uncertainty without claiming a confirmed day', () => {
  const { app } = loadApp();
  const e = entry({ estimated: true, abstractDate: '2027-03-15', paperDate: '2027-03-22' });
  const html = app.cardHTML(e);
  assert.match(html, /~est/);
  assert.match(html, /Estimated paper/);
  assert.match(html, /Mar 22, 2027/);
  assert.match(html, /Abstract<\/strong> Mar 15, 2027/);
  assert.doesNotMatch(html, /The day is confirmed|D-DAY|D-\d|\+ Calendar/);
});

test('rolling submissions are shown as having no fixed deadline', () => {
  const e = entry({ deadlineStatus: 'rolling' });
  const { app, elements } = loadApp([e]);
  const html = app.cardHTML(e);
  assert.match(html, /Rolling submissions/);
  assert.match(html, /No fixed deadline/);
  assert.doesNotMatch(html, /Deadline not confirmed|>TBD<|D-DAY|D-\d|\+ Calendar/);
  assert.equal(app.passesFilter(e), true);
  app.render();
  assert.doesNotMatch(elements.get('summary').innerHTML, /next:/);
});

test('official sources are not mislabeled as DBLP for unknown or date-only deadlines', () => {
  const { app } = loadApp();
  for (const extra of [{}, { paperDate: '2026-07-31' }]) {
    const html = app.cardHTML(entry(extra));
    assert.match(html, />Official ↗<\/a>/);
    assert.doesNotMatch(html, />DBLP ↗<\/a>/);
  }
  assert.match(app.cardHTML(entry({ link: 'https://dblp.org/db/conf/example.html' })), />DBLP ↗<\/a>/);
  assert.match(app.cardHTML(entry({ link: 'https://example.org/?source=dblp.org' })), />Official ↗<\/a>/);
  assert.match(app.cardHTML(entry({ link: 'https://dblp.org.example.org/' })), />Official ↗<\/a>/);
});

test('date-only entries stay in the unknown sort group and do not become the next countdown', () => {
  const entries = [
    entry({ name: 'Date only 2027', paperDate: '2026-09-18' }),
    entry({ name: 'Exact 2027', paper: '2026-09-24T23:59:00-12:00', tz: 'AoE' }),
  ];
  const { app, elements } = loadApp(entries);
  assert.equal(app.rankOf(entries[0]), 1);
  assert.ok(app.sortDeadlines(entries[1], entries[0]) < 0);
  assert.equal(app.passesFilter(entries[0]), true);
  app.render();
  assert.match(elements.get('summary').innerHTML, /next: <strong>Exact 2027<\/strong>/);
  const unknownOnly = loadApp([entries[0]]);
  unknownOnly.app.render();
  assert.doesNotMatch(unknownOnly.elements.get('summary').innerHTML, /next:|D-DAY|D-\d/);
});

test('date-only deadlines stay uncertain until their published day has ended everywhere', () => {
  const e = entry({ paperDate: '2026-09-18' });
  const justBefore = loadApp([e], Date.parse('2026-09-19T11:59:59.999Z')).app;
  assert.equal(Boolean(justBefore.isPassed(e)), false);
  assert.equal(justBefore.passesFilter(e), true);
  assert.equal(justBefore.rankOf(e), 1);
  assert.doesNotMatch(justBefore.cardHTML(e), /ended|D-DAY|D-\d|\+ Calendar/);

  const afterDayEnded = loadApp([e], Date.parse('2026-09-19T12:00:00Z')).app;
  assert.equal(afterDayEnded.isPassed(e), true);
  assert.equal(afterDayEnded.passesFilter(e), false);
  assert.equal(afterDayEnded.rankOf(e), 2);
});

test('old date-only deadlines appear only with passed entries and retain their uncertainty', () => {
  const old = entry({ name: 'Closed date only', paperDate: '2026-07-31' });
  const { app, elements } = loadApp([old]);
  app.render();
  assert.doesNotMatch(elements.get('list').innerHTML, /Closed date only/);
  vm.runInContext('state.showPassed = true', app);
  app.render();
  const html = elements.get('list').innerHTML;
  assert.match(html, /Closed date only/);
  assert.match(html, /ended/);
  assert.match(html, /Jul 31, 2026/);
  assert.match(html, /Date only/);
  assert.match(html, /Time \/ timezone unconfirmed/);
  assert.doesNotMatch(html, /23:59|UTC|AoE|\+ Calendar/);

  const recent = entry({ paper: '2026-08-10T17:59:00-05:00' });
  assert.ok(app.sortDeadlines(recent, old) < 0);
});

test('AoE exact deadlines create calendar events at the corresponding UTC instant', () => {
  const { app } = loadApp();
  const e = entry({ paper: '2026-09-24T23:59:00-12:00', tz: 'AoE' });
  const calendar = new URL(app.gcalLink(e, app.targetOf(e)));
  assert.equal(calendar.searchParams.get('dates'), '20260925T112900Z/20260925T115900Z');
  assert.equal(app.daysLeft(e.paper), 7);
  const html = app.cardHTML(e);
  assert.match(html, /Paper<\/strong> Sep 24, 2026/);
  assert.match(html, /D-7/);
  assert.match(html, />CFP ↗<\/a>/);
  assert.match(html, /\+ Calendar/);
});

test('calendar events preserve official cutoff seconds instead of rounding them away', () => {
  const { app } = loadApp();
  const e = entry({ paper: '2026-09-24T23:59:59-12:00', tz: 'AoE' });
  const calendar = new URL(app.gcalLink(e, app.targetOf(e)));
  assert.equal(calendar.searchParams.get('dates'), '20260925T112959Z/20260925T115959Z');
});

test('future abstract deadlines remain the next target, then switch to paper when passed', () => {
  const { app } = loadApp();
  const upcoming = entry({ abstract: '2026-09-20T23:59:00-12:00', paper: '2026-09-24T23:59:00-12:00', tz: 'AoE' });
  assert.equal(app.targetOf(upcoming).label, 'abstract');
  assert.match(app.cardHTML(upcoming), /to abstract/);
  const passedAbstract = { ...upcoming, abstract: '2026-09-17T23:59:00-12:00' };
  assert.equal(app.targetOf(passedAbstract).label, 'paper');
  assert.match(app.cardHTML(passedAbstract), /sub-passed/);
  assert.match(app.cardHTML(passedAbstract), /to paper/);
});

test('passed exact deadlines remain hidden by default and never offer a calendar link', () => {
  const { app } = loadApp();
  const e = entry({ paper: '2026-09-17T23:59:00-04:00', tz: 'US EDT' });
  assert.equal(app.passesFilter(e), false);
  const html = app.cardHTML(e);
  assert.match(html, /ended/);
  assert.doesNotMatch(html, /\+ Calendar/);
});
