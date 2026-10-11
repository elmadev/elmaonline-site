import { routes } from './routes';
import { smokeTest } from './smokeTest';

// Pages are explored in the user project, which sees the same pages with more
// to interact with. As guest only pages that differ for guests are explored,
// everything else is checked on load, which keeps the run a lot shorter.
smokeTest(routes, 'guest', route => route.exploreAsGuest);
