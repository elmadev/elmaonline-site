import { useRef, useEffect } from 'react';

const inputElements = ['TEXTAREA', 'INPUT', 'SELECT'];
const shouldSuppressEvent = (suppressInInputs, key) => {
  // always suppress enter so you can make new lines in text area
  if (key === 'Enter' && document.activeElement.tagName === 'TEXTAREA') {
    return true;
  }
  if (
    (suppressInInputs &&
      inputElements.indexOf(document.activeElement.tagName) > -1) ||
    document.getElementsByClassName('modal in').length > 0
  ) {
    return true;
  }
  return false;
};

export default function useKeyPress(
  key,
  handler,
  suppressInInputs = false,
  element = window,
) {
  // Create a ref that stores handler
  const savedHandler = useRef();

  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      // Make sure element supports addEventListener
      const isSupported = element && element.addEventListener;
      if (!isSupported) return;

      // Create event listener that calls handler function stored in ref
      const eventListener = event => {
        event.stopPropagation();
        const cleanKeyName = key.trim();
        if (!cleanKeyName.includes('+')) {
          if (
            event.key === cleanKeyName &&
            !event.altKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.metaKey &&
            !shouldSuppressEvent(suppressInInputs, key)
          ) {
            event.preventDefault();
            savedHandler.current(event, cleanKeyName);
          }
        } else {
          const keys = cleanKeyName.split(/\s?\+\s?/); // e.g. 'crtl + a'
          if (
            keys[0] === 'ctrl' &&
            event.key === keys[1] &&
            event.ctrlKey &&
            !shouldSuppressEvent(suppressInInputs, key)
          ) {
            event.preventDefault();
            savedHandler.current(event, cleanKeyName);
          }
        }
      };

      // Add event listener
      element.addEventListener('keydown', eventListener);

      // Remove event listener on cleanup
      return () => {
        element.removeEventListener('keydown', eventListener);
      };
    },
    [key, element], // Re-run if eventName or element changes
  );
}
