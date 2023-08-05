import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
import { formatPath } from './helper';
import { homeDir } from '@tauri-apps/api/path';

const CONFIGS_KEY = 'CONFIGS';

export type ConfigsType = {
  projectPath: string;
  feedsPath: string;
  afterCommand: string;
};

export const savedConfigs = () => {
  let data: ConfigsType;
  const rawData = localStorage.getItem(CONFIGS_KEY);

  if (rawData) {
    data = JSON.parse(rawData);
  } else {
    data = {
      projectPath: '',
      feedsPath: '',
      afterCommand: '',
    };
  }

  return data;
};

export const setSavedConfigs = (configs: ConfigsType) => {
  localStorage.setItem(CONFIGS_KEY, JSON.stringify(configs));
};

export const readConfigFile = async (
  type: keyof ConfigsType,
  configs?: ConfigsType
) => {
  const realConfigs = configs ?? savedConfigs();
  const contents = await readTextFile(formatPath(realConfigs[type]), {
    dir: BaseDirectory.Home,
  });

  console.warn(contents);
};

export const getFeedsConfigPath = async () => {
  const homeDirPath = await homeDir();
  const feedsPath =
    homeDirPath + formatPath(savedConfigs().feedsPath) + '/snapshot.json';

  return feedsPath;
};
