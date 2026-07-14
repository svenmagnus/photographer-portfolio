import * as migration_20260710_184534_initial from './20260710_184534_initial';
import * as migration_20260714_113926_pages_and_navigation from './20260714_113926_pages_and_navigation';

export const migrations = [
  {
    up: migration_20260710_184534_initial.up,
    down: migration_20260710_184534_initial.down,
    name: '20260710_184534_initial',
  },
  {
    up: migration_20260714_113926_pages_and_navigation.up,
    down: migration_20260714_113926_pages_and_navigation.down,
    name: '20260714_113926_pages_and_navigation'
  },
];
