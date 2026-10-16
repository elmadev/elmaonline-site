import { useEffect } from 'react';

const nativeKeys = [
  'ArrowUp',
  'ArrowDown',
  'PageUp',
  'PageDown',
  'Home',
  'End',
  'Tab',
  'Enter',
  'Escape',
];

const isEditable = el =>
  el &&
  (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) ||
    el.isContentEditable);

const isVisible = el => {
  const r = el.getBoundingClientRect();
  return (
    r.width > 0 &&
    r.height > 0 &&
    r.bottom > 0 &&
    r.right > 0 &&
    r.top < window.innerHeight &&
    r.left < window.innerWidth
  );
};

let mounted = 0;
let lastActive = null;

const onFocusIn = e => {
  const player = e.target.closest?.('.RecPlayer');
  if (player) lastActive = player;
};

const onKeyDown = e => {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return;
  if (nativeKeys.includes(e.key)) return;
  // The player handles its own keys when focused
  if (e.target.closest?.('.RecPlayer')) return;
  if (isEditable(e.target) || isEditable(document.activeElement)) return;
  // Space presses a focused button or link
  if (
    e.key === ' ' &&
    e.target.closest?.('button, a[href], summary, [role="button"]')
  ) {
    return;
  }
  if (document.querySelector('[role="dialog"]:not(.RecPlayer *), .modal.in')) {
    return;
  }

  const players = [...document.querySelectorAll('.RecPlayer')].filter(
    isVisible,
  );
  const player = players.includes(lastActive) ? lastActive : players[0];
  const viewer = player?.querySelector('[tabindex]');
  if (!viewer) return;

  const forwarded = new KeyboardEvent('keydown', {
    key: e.key,
    code: e.code,
    shiftKey: e.shiftKey,
    repeat: e.repeat,
    bubbles: true,
    cancelable: true,
  });
  if (!viewer.dispatchEvent(forwarded)) e.preventDefault();
};

// Lets the RecPlayer's keyboard shortcuts work without focusing it first, for
// the player last interacted with or else the first one in view
export default function useRecplayerKeys() {
  useEffect(() => {
    if (mounted++ === 0) {
      document.addEventListener('focusin', onFocusIn);
      window.addEventListener('keydown', onKeyDown);
    }
    return () => {
      if (--mounted === 0) {
        document.removeEventListener('focusin', onFocusIn);
        window.removeEventListener('keydown', onKeyDown);
        lastActive = null;
      }
    };
  }, []);
}
