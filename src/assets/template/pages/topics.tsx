import { TemplateFeeds } from '../components/Feeds';
import { TemplateLayout } from '../components/Layout';
import type { TemplateFeedType } from '../components/Feed';

interface TemplateTopicsProps {
  topics: TemplateFeedType[];
}

export const TemplateTopics: React.FC<TemplateTopicsProps> = ({ topics }) => (
  <TemplateLayout title='Topics / Feed / Paraparata'>
    <TemplateFeeds feeds={topics} />
  </TemplateLayout>
);
