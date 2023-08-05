import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ConfigsStore = {
  isMenuOpen: boolean;
  isEditing: boolean;
  repoUrl: string;
  feedsPath: string;
};

const CONFIGS: ConfigsStore = {
  isMenuOpen: false,
  isEditing: false,
  repoUrl: '',
  feedsPath: '',
};

const useConfigs = create<ConfigsStore>()(
  persist(() => CONFIGS, {
    name: 'konyako-satay-bag',
  })
);

export { useConfigs };
export type { ConfigsStore };
