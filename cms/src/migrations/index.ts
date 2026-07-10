import * as migration_20260710_184534_initial from './20260710_184534_initial';

export const migrations = [
  {
    up: migration_20260710_184534_initial.up,
    down: migration_20260710_184534_initial.down,
    name: '20260710_184534_initial'
  },
];
