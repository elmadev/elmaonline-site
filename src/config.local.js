if (process.env.BROWSER) {
  throw new Error(
    'Do not import `config.js` from inside the client-side code.',
  );
}

// add keys from defaults.js that you want to change the value for
// changes to this file will not be seen by git
export default {};
