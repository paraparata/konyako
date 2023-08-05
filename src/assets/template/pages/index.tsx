import { TemplateFeeds } from '../components/Feeds';
import { TemplateLayout } from '../components/Layout';
import type { TemplateFeedType } from '../components/Feed';

interface TemplateIndexProps {
  feeds: TemplateFeedType[];
}

export const TemplateIndex: React.FC<TemplateIndexProps> = ({ feeds }) => (
  <TemplateLayout title='Feeds / Paraparata'>
    <TemplateFeeds feeds={feeds} />
  </TemplateLayout>
);
