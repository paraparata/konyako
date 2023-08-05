import { getFeedsConfigPath } from '@libs/apiv0';
import { useCallback, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { writeTextFile } from '@tauri-apps/api/fs';
import { homeDir } from '@tauri-apps/api/path';
import { formatPath } from '@libs/helper';

import type { FeedType } from '@components/Feeds';
import { renderToStaticMarkup } from 'react-dom/server';
import { TemplateIndex } from '../../assets/template/pages/index';

export const useTemplateCreator = () => {
  const [feeds, setFeeds] = useState<FeedType[]>([]);

  useEffect(() => {
    getFeedsConfigPath().then((path) => {
      invoke('get_topic', {
        path: path,
      })
        .then((raw) => {
          const data = JSON.parse(raw as string) as FeedType[];
          setFeeds(data);
        })
        .catch((err) => {
          console.warn(err);
          setFeeds([]);
        });
    });
  }, []);

  const create = useCallback(
    async (path: string) => {
      const timelinePage = <TemplateIndex feeds={feeds} />;
      const html = '<!DOCTYPE html>\n' + renderToStaticMarkup(timelinePage);

      const homeDirPath = await homeDir();
      path = homeDirPath + formatPath(path);

      await writeTextFile(`${path}/index.html`, html);
      // await copyFile(
      //   homeDirPath + formatPath('src/assets/template/style.css'),
      //   `${path}/style.css`
      // );

      return html;
    },
    [feeds]
  );

  return { create };
};
