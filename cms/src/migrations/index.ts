import * as migration_20260710_184534_initial from './20260710_184534_initial';
import * as migration_20260714_113926_pages_and_navigation from './20260714_113926_pages_and_navigation';
import * as migration_20260714_120431_contact_phone from './20260714_120431_contact_phone';
import * as migration_20260714_122702_pages_gallery_nav from './20260714_122702_pages_gallery_nav';
import * as migration_20260714_202800_main_menu from './20260714_202800_main_menu';
import * as migration_20260714_222400_blog_posts from './20260714_222400_blog_posts';
import * as migration_20260714_234500_blog_post_featured_images from './20260714_234500_blog_post_featured_images';
import * as migration_20260714_235000_blog_post_list_columns from './20260714_235000_blog_post_list_columns';

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
    name: '20260714_120431_contact_phone',
  },
  {
    up: migration_20260714_122702_pages_gallery_nav.up,
    down: migration_20260714_122702_pages_gallery_nav.down,
    name: '20260714_122702_pages_gallery_nav'
  },
  {
    up: migration_20260714_202800_main_menu.up,
    down: migration_20260714_202800_main_menu.down,
    name: '20260714_202800_main_menu',
  },
  {
    up: migration_20260714_222400_blog_posts.up,
    down: migration_20260714_222400_blog_posts.down,
    name: '20260714_222400_blog_posts',
  },
  {
    up: migration_20260714_234500_blog_post_featured_images.up,
    down: migration_20260714_234500_blog_post_featured_images.down,
    name: '20260714_234500_blog_post_featured_images',
  },
  {
    up: migration_20260714_235000_blog_post_list_columns.up,
    down: migration_20260714_235000_blog_post_list_columns.down,
    name: '20260714_235000_blog_post_list_columns',
  },
];
