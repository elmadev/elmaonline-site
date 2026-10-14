import sanitize from 'sanitize-html';

// cleans user written html (cup descriptions, cup blogs, league descriptions)
// before it's saved. the web sanitizes again on render, this keeps scripts,
// event handlers and javascript: urls out of the database in the first place.
export const sanitizeHtml = html =>
  sanitize(typeof html === 'string' ? html : '', {
    allowedTags: [...sanitize.defaults.allowedTags, 'img', 'font', 'center'],
    allowedAttributes: {
      '*': ['style', 'class', 'align', 'title'],
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height'],
      font: ['color', 'size', 'face'],
    },
  });
