import { config } from '../../config';
import MockRecommender from './mock.recommender';
import ExternalRecommender from './external.recommender';

const impl = config.aiProvider === 'external' ? ExternalRecommender : MockRecommender;
export default impl;
