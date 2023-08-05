import { TemplateFeed } from '../components/Feed';
import { TemplateLayout } from '../components/Layout';
import type { TemplateFeedType } from '../components/Feed';

interface TemplateFeedByIdProps {
  topicTitle?: string;
  topicData: TemplateFeedType[];
}

export const TemplateFeedById: React.FC<TemplateFeedByIdProps> = ({
  topicTitle,
  topicData,
}) => (
  <TemplateLayout title={`[${topicTitle ?? 'Feed'}] / Feed / Paraparata`}>
    <style>
      {`
        .container {
          display: flex;
          flex-direction: column;
        }
        `}
    </style>
    <div className='container'>
      {topicData.map((feed, index) => (
        <TemplateFeed
          key={feed.id}
          data={feed}
          order={
            topicData.length > 1
              ? index === 0
                ? 'top'
                : index === topicData.length - 1
                ? 'last'
                : 'middle'
              : 'none'
          }
        />
      ))}
    </div>
  </TemplateLayout>
);
