import { userRoutes } from './routes';
import { smokeTest } from './smokeTest';

smokeTest(userRoutes, 'user');
