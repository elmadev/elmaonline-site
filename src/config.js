import defaults from './config.defaults.js';
import local from './config.local.js';

// combine defaults with local config, giving priority to local
export default { ...defaults, ...local };
