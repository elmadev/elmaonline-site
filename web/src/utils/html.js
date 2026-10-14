import DOMPurify from 'dompurify';

// strips scripts, event handlers and javascript: urls from user written html
// before it's rendered with dangerouslySetInnerHTML. forms and styles are
// removed too so descriptions can't fake login forms or restyle the site.
export const sanitizeHtml = html =>
  DOMPurify.sanitize(html || '', {
    FORBID_TAGS: ['style', 'form', 'input', 'textarea', 'button', 'select'],
  });
