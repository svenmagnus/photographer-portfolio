import * as migration_20260710_184534_initial from './20260710_184534_initial';
import * as migration_20260714_113926_pages_and_navigation from './20260714_113926_pages_and_navigation';
import * as migration_20260714_120431_contact_phone from './20260714_120431_contact_phone';

export const migrations = [
  {
    up: migration_20260710_184534_initial.up,
    down: migration_20260710_184534_initial.down,
    name: '20260710_184534_initial',
  },
  {
    up: migration_20260714_113926_pages_and_navigation.up,
    down: migration_20260714_113926_pages_and_navigation.down,
    name: '20260714_113926_pages_and_navigation',
  },
  {
    up: migration_20260714_120431_contact_phone.up,
    down: migration_20260714_120431_contact_phone.down,
    name: '20260714_120431_contact_phone'
  },
];
