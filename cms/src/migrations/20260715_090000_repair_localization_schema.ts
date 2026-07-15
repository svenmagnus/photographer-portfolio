import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Repairs production DB after a failed localization push.
 * Restores main-table columns from *_locales tables when needed.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      -- pages: restore title + SEO columns on main table
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages') THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'pages' AND column_name = 'title'
        ) THEN
          ALTER TABLE "pages" ADD COLUMN "title" varchar;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'pages' AND column_name = 'meta_title'
        ) THEN
          ALTER TABLE "pages" ADD COLUMN "meta_title" varchar;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'pages' AND column_name = 'meta_description'
        ) THEN
          ALTER TABLE "pages" ADD COLUMN "meta_description" varchar;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_locales') THEN
          UPDATE "pages" AS p
          SET
            "title" = COALESCE(p."title", pl."title"),
            "meta_title" = COALESCE(p."meta_title", pl."meta_title"),
            "meta_description" = COALESCE(p."meta_description", pl."meta_description")
          FROM "pages_locales" AS pl
          WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'de';
        END IF;

        UPDATE "pages" SET "title" = "slug" WHERE "title" IS NULL OR "title" = '';
      END IF;

      -- blog_posts: restore localized columns on main table
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts') THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'blog_posts' AND column_name = 'title'
        ) THEN
          ALTER TABLE "blog_posts" ADD COLUMN "title" varchar;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'blog_posts' AND column_name = 'excerpt'
        ) THEN
          ALTER TABLE "blog_posts" ADD COLUMN "excerpt" varchar;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'blog_posts' AND column_name = 'content'
        ) THEN
          ALTER TABLE "blog_posts" ADD COLUMN "content" jsonb;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'blog_posts' AND column_name = 'meta_title'
        ) THEN
          ALTER TABLE "blog_posts" ADD COLUMN "meta_title" varchar;
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'blog_posts' AND column_name = 'meta_description'
        ) THEN
          ALTER TABLE "blog_posts" ADD COLUMN "meta_description" varchar;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blog_posts_locales') THEN
          UPDATE "blog_posts" AS b
          SET
            "title" = COALESCE(b."title", bl."title"),
            "excerpt" = COALESCE(b."excerpt", bl."excerpt"),
            "content" = COALESCE(b."content", bl."content"),
            "meta_title" = COALESCE(b."meta_title", bl."meta_title"),
            "meta_description" = COALESCE(b."meta_description", bl."meta_description")
          FROM "blog_posts_locales" AS bl
          WHERE bl."_parent_id" = b."id" AND bl."_locale" = 'de';
        END IF;

        UPDATE "blog_posts" SET "title" = "slug" WHERE "title" IS NULL OR "title" = '';
      END IF;

      -- site_settings: restore localized columns
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings') THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'site_settings' AND column_name = 'photographer_title'
        ) THEN
          ALTER TABLE "site_settings" ADD COLUMN "photographer_title" varchar DEFAULT 'Photographer';
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'site_settings' AND column_name = 'meta_description'
        ) THEN
          ALTER TABLE "site_settings" ADD COLUMN "meta_description" varchar;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'site_settings_locales') THEN
          UPDATE "site_settings" AS s
          SET
            "photographer_title" = COALESCE(s."photographer_title", sl."photographer_title"),
            "meta_description" = COALESCE(s."meta_description", sl."meta_description")
          FROM "site_settings_locales" AS sl
          WHERE sl."_parent_id" = s."id" AND sl."_locale" = 'de';
        END IF;
      END IF;

      -- main menu: restore label column on items if moved to locales
      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'main_menu_items') THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'main_menu_items' AND column_name = 'label'
        ) THEN
          ALTER TABLE "main_menu_items" ADD COLUMN "label" varchar;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'main_menu_items_locales') THEN
          UPDATE "main_menu_items" AS m
          SET "label" = COALESCE(m."label", ml."label")
          FROM "main_menu_items_locales" AS ml
          WHERE ml."_parent_id" = m."id" AND ml."_locale" = 'de';
        END IF;
      END IF;

      IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'main_menu_items_children') THEN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'main_menu_items_children' AND column_name = 'label'
        ) THEN
          ALTER TABLE "main_menu_items_children" ADD COLUMN "label" varchar;
        END IF;

        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'main_menu_items_children_locales') THEN
          UPDATE "main_menu_items_children" AS m
          SET "label" = COALESCE(m."label", ml."label")
          FROM "main_menu_items_children_locales" AS ml
          WHERE ml."_parent_id" = m."id" AND ml."_locale" = 'de';
        END IF;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Repair migration — no rollback.
  await db.execute(sql`SELECT 1`)
}
