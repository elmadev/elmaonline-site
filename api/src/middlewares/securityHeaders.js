// the api serves json and files, including user uploads which may be html,
// svg or js. these headers make sure nothing served from the api domain can
// run as a page: no content type sniffing, and a csp that blocks scripts,
// forms, plugins and framing if a browser ever renders a response directly.
// images and files loaded from the web app with <img>, fetch etc. are not
// affected. web app headers are set in caddy.
export default function securityHeaders(req, res, next) {
  res.set({
    'X-Content-Type-Options': 'nosniff',
    'Content-Security-Policy':
      "default-src 'none'; frame-ancestors 'none'; sandbox",
  });
  next();
}
