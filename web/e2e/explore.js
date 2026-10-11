// Generic page exploration: fills in forms, attaches files, clicks buttons,
// tabs, checkboxes and selects and submits text inputs inside a part of the
// page, one at a time, so calls and crashes behind interactions are covered
// without page specific test code.
//
// After every interaction the page is scanned again and the first element not
// visited yet (in DOM order) is next, so elements that appear after an
// interaction (eg. a search input after picking a search type) are covered too.
// When a dialog, drawer or menu is open it's explored first and closed when
// nothing is left in it, like a user would.
// No randomness, so runs are reproducible and the api snapshot stays stable.

const interactive = [
  'button',
  '[role=button]',
  '[role=tab]',
  '[role=checkbox]',
  '[role=switch]',
  '[role=radio]',
  '[role=combobox]',
  'input[type=checkbox]',
  'input[type=radio]',
  'input[type=text]',
  'input[type=search]',
  'input:not([type])',
  'textarea',
].join(',');

// fields filled in up front, so forms with several required fields validate
const fillable = [
  'input[type=text]',
  'input[type=search]',
  'input:not([type])',
  'input[type=email]',
  'input[type=url]',
  'input[type=number]',
  'input[type=password]',
  'input[type=date]',
  'input[type=datetime-local]',
  'input[type=time]',
  'textarea',
].join(',');

// MUI renders dialogs, drawers, menus and popovers in a portal on body
const overlays = 'body > [role=presentation], [role=dialog]';

const popupOptions =
  '[role=listbox] [role=option], [role=menu] [role=menuitem]';

// never click these, they'd end the session for the rest of the exploration
const skipText = /^log ?out$/i;

// third party widgets whose controls don't talk to the api, but disturb the
// rest of the exploration (the replay player's fullscreen covers the page)
const skipWithin = '[class*=RecPlayer]';

const fixtures = new URL('./fixtures/', import.meta.url).pathname;

const fixtureFor = accept => {
  if (/\.lev\b/.test(accept)) return 'level.lev';
  if (/\.lgr\b/.test(accept)) return 'e2e.lgr';
  if (/\.dat\b/.test(accept)) return 'state.dat';
  if (/image/.test(accept)) return 'image.png';
  return 'replay.rec';
};

const today = () => new Date().toISOString().slice(0, 10);

// a value that passes the usual validation for the field
const valueFor = ({ type, hint }, text) => {
  if (type === 'email' || /mail/i.test(hint)) return 'e2e@example.com';
  if (type === 'url' || /\b(url|link|website)\b/i.test(hint))
    return 'https://example.com';
  if (type === 'password' || /password/i.test(hint)) return 'e2etest123';
  if (type === 'number') return '1';
  if (type === 'date') return today();
  if (type === 'datetime-local') return `${today()}T12:00`;
  if (type === 'time') return '12:00';
  return text;
};

// Marks the topmost open overlay (if any) as the root to explore, otherwise
// the scope, and returns its selector.
const currentRoot = (page, scope) =>
  page.evaluate(
    ({ scope, overlays }) => {
      document
        .querySelectorAll('[data-explore-root]')
        .forEach(el => el.removeAttribute('data-explore-root'));
      // closed menus can stay mounted with visibility: hidden
      const visible = el => el.checkVisibility({ visibilityProperty: true });
      // pages can also render their own fixed full screen layers (eg. an
      // image preview, not necessarily inside the scope), which cover
      // everything else just the same
      const fullscreen = [...document.body.querySelectorAll('*')].filter(el => {
        if (getComputedStyle(el).position !== 'fixed') return false;
        const rect = el.getBoundingClientRect();
        return (
          rect.width * rect.height >
          0.8 * window.innerWidth * window.innerHeight
        );
      });
      const open = [
        ...document.querySelectorAll(overlays),
        ...fullscreen,
      ].filter(visible);
      if (!open.length) return scope;
      open[open.length - 1].setAttribute('data-explore-root', '');
      return '[data-explore-root]';
    },
    { scope, overlays },
  );

// Fills empty fields and attaches fixtures to file inputs in the root.
const prepare = async (page, root, text) => {
  const fields = await page.evaluate(
    ({ root, fillable }) => {
      // reachable by users: enabled, rendered and not hidden from them (eg. the
      // hidden native input of MUI selects)
      const reachable = el => {
        const rect = el.getBoundingClientRect();
        return (
          !el.disabled &&
          el.getAttribute('aria-disabled') !== 'true' &&
          !el.closest('[aria-hidden=true]') &&
          // MUI tabs use tabindex -1 for unselected tabs, so only inputs
          !(el.tagName === 'INPUT' && el.tabIndex < 0) &&
          (rect.width || rect.height) &&
          el.checkVisibility({ visibilityProperty: true })
        );
      };
      const container = document.querySelector(root);
      if (!container) return [];
      const found = [];
      container.querySelectorAll(fillable).forEach(el => {
        if (el.value || el.readOnly || !reachable(el)) return;
        const label = el
          .closest('.MuiFormControl-root, div')
          ?.querySelector('label')?.textContent;
        el.setAttribute('data-explore-fill', found.length);
        found.push({
          type: el.getAttribute('type') || 'text',
          hint: [el.name, el.id, el.placeholder, label]
            .filter(Boolean)
            .join(' '),
        });
      });
      // file inputs are usually hidden (eg. react-dropzone), so no reachable check
      container.querySelectorAll('input[type=file]').forEach(el => {
        if (el.files?.length || el.disabled) return;
        el.setAttribute('data-explore-fill', found.length);
        found.push({ type: 'file', hint: el.accept || '' });
      });
      return found;
    },
    { root, fillable },
  );
  for (const [index, field] of fields.entries()) {
    const element = page.locator(`[data-explore-fill="${index}"]`).first();
    if (field.type === 'file') {
      await element
        .setInputFiles(fixtures + fixtureFor(field.hint), { timeout: 2000 })
        .catch(() => {});
    } else {
      await element
        .fill(valueFor(field, text), { timeout: 2000 })
        .catch(() => {});
    }
  }
  return fields.length;
};

// Tags the candidates with data-explore=<index into the returned signatures>
// and returns the signatures in DOM order. Elements that look the same (eg.
// one button per table row) share a signature and are only visited once,
// which also keeps the result independent of how many rows the data has.
// Lists of different looking siblings (eg. a row of tag buttons) are capped
// at `siblings` per list for the same reason, tabs excepted.
const scan = (page, root, skipText, siblings) =>
  page.evaluate(
    ({ root, selector, skipText, skipWithin, siblings }) => {
      // reachable by users: enabled, rendered and not hidden from them (eg. the
      // hidden native input of MUI selects)
      const reachable = el => {
        const rect = el.getBoundingClientRect();
        return (
          !el.disabled &&
          el.getAttribute('aria-disabled') !== 'true' &&
          !el.closest('[aria-hidden=true]') &&
          // MUI tabs use tabindex -1 for unselected tabs, so only inputs
          !(el.tagName === 'INPUT' && el.tabIndex < 0) &&
          (rect.width || rect.height) &&
          el.checkVisibility({ visibilityProperty: true })
        );
      };
      const container = document.querySelector(root);
      const skip = new RegExp(skipText, 'i');
      const signatures = [];
      const groups = new Map();
      document
        .querySelectorAll('[data-explore]')
        .forEach(el => el.removeAttribute('data-explore'));
      if (!container) return signatures;
      const isPointer = el => el && getComputedStyle(el).cursor === 'pointer';
      for (const el of container.querySelectorAll('*')) {
        const standard = el.matches(selector);
        // plain elements with a click handler (eg. clickable list rows) are
        // recognized by their pointer cursor. It's inherited, so only the
        // outermost one counts, and not when it wraps a real control.
        const clickable =
          !standard &&
          isPointer(el) &&
          !isPointer(el.parentElement) &&
          !el.closest(selector) &&
          !el.querySelector(selector) &&
          !['LABEL', 'svg', 'path', 'IMG', 'A'].includes(el.tagName);
        if (!standard && !clickable) continue;
        if (el.closest('a[href]') || el.closest(skipWithin)) continue;
        if (!reachable(el)) continue;
        // only expand, collapsing (eg. an accordion) just hides things to explore
        if (el.getAttribute('aria-expanded') === 'true') continue;
        const text = (el.textContent || '').trim();
        if (skip.test(text)) continue;
        // rows of the same kind are one visit, whatever their text
        const className = String(el.className).replace(/\d+/g, '#');
        if (el.getAttribute('role') !== 'tab') {
          const group = el.parentElement;
          const kind = clickable
            ? `${el.tagName}|${className}`
            : `${el.tagName}|${el.getAttribute('role')}`;
          const counts = groups.get(group) || {};
          counts[kind] = (counts[kind] || 0) + 1;
          groups.set(group, counts);
          if (counts[kind] > siblings) continue;
        }
        const signature = clickable
          ? `pointer|${el.tagName}|${className}`
          : [
              el.tagName,
              el.getAttribute('role'),
              el.getAttribute('type'),
              el.getAttribute('aria-label'),
              el.getAttribute('placeholder'),
              text.replace(/\d+/g, '#').slice(0, 40),
            ].join('|');
        if (!signatures.includes(signature)) signatures.push(signature);
        el.setAttribute('data-explore', signatures.indexOf(signature));
      }
      return signatures;
    },
    {
      root,
      selector: interactive,
      skipText: skipText.source,
      skipWithin,
      siblings,
    },
  );

const describe = locator =>
  locator.evaluate(el =>
    [
      el.getAttribute('role') || el.tagName.toLowerCase(),
      el.getAttribute('aria-label') ||
        el.getAttribute('placeholder') ||
        (el.textContent || '').trim().slice(0, 40),
    ].join(' '),
  );

const inputKind = locator =>
  locator.evaluate(el => {
    if (el.tagName === 'TEXTAREA') return 'textarea';
    if (
      el.tagName === 'INPUT' &&
      ['text', 'search', ''].includes(el.getAttribute('type') || '')
    )
      return 'input';
    return null;
  });

const interact = async (element, text) => {
  const kind = await inputKind(element);
  if (kind) {
    await element.fill(text, { timeout: 2000 });
    // inputs like the search bar only act on enter
    if (kind === 'input') await element.press('Enter', { timeout: 2000 });
  } else {
    const toggle = await element.evaluate(
      el => el.tagName === 'INPUT' && ['radio', 'checkbox'].includes(el.type),
    );
    if (toggle) {
      // often visually hidden (eg. MUI Rating, 1x1 px under the icon) so a
      // pointer click can't reach them, a DOM click fires the same change
      await element.evaluate(el => el.click());
    } else {
      await element.click({ timeout: 2000 });
    }
  }
};

export const explore = async (
  page,
  api,
  {
    scope = 'main',
    max = 20,
    siblings = 6,
    text = 'test',
    quietMs = 750,
    skip,
  } = {},
) => {
  const visited = [];
  const seen = new Set();
  // route specific texts to skip on top of the defaults
  const skipAll = skip
    ? new RegExp(`${skipText.source}|${skip.source}`, 'i')
    : skipText;
  const startUrl = page.url();
  let closeAttempts = 0;

  // don't get stuck on confirm() dialogs or popup windows
  page.on('dialog', dialog => dialog.dismiss().catch(() => {}));
  page.context().on('page', popup => popup.close().catch(() => {}));

  while (visited.length < max) {
    const root = await currentRoot(page, scope);
    if (await prepare(page, root, text)) await api.settle(quietMs);

    const signatures = await scan(page, root, skipAll, siblings);
    const index = signatures.findIndex(s => !seen.has(s));
    if (index === -1) {
      if (root === scope) break;
      // nothing left in the overlay, close it and carry on with the page
      if (++closeAttempts > 3) break;
      // escape closes MUI overlays, clicking the backdrop most others
      if (closeAttempts === 1) {
        await page.keyboard.press('Escape').catch(() => {});
      } else {
        await page.mouse.click(5, 5).catch(() => {});
      }
      await api.settle(quietMs);
      continue;
    }
    closeAttempts = 0;
    seen.add(signatures[index]);

    const element = page.locator(`[data-explore="${index}"]`).first();
    try {
      visited.push(await describe(element));
      await interact(element, text);
    } catch {
      continue;
    }
    await api.settle(quietMs);

    // pick an option if a select or menu opened, then make sure it's closed
    const option = page
      .locator(popupOptions)
      .filter({ hasNotText: skipAll })
      .last();
    if (await option.isVisible().catch(() => false)) {
      await option.click({ timeout: 2000 }).catch(() => {});
      await api.settle(quietMs);
      if (await option.isVisible().catch(() => false)) {
        await page.keyboard.press('Escape').catch(() => {});
      }
    }

    // an interaction navigated somewhere else, go back and continue. Only the
    // path counts, pages like search keep their filters in the query string
    if (new URL(page.url()).pathname !== new URL(startUrl).pathname) {
      await page.goBack().catch(() => {});
      if (new URL(page.url()).pathname !== new URL(startUrl).pathname) {
        await page.goto(startUrl);
      }
      await api.settle(quietMs);
    }
  }
  return visited;
};
