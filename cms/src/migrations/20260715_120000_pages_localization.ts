import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Aktiviert Payload-Lokalisierung für Seiten (title, layout, meta) und Menü-Labels.
 * Idempotent — funktioniert auch wenn ein früherer Push-Deploy Teile angelegt hat.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_pages_locales_locale') THEN
        CREATE TYPE "public"."enum_pages_locales_locale" AS ENUM('de', 'en');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'pages_locales') THEN
        CREATE TABLE "pages_locales" (
          "id" serial PRIMARY KEY NOT NULL,
          "_parent_id" integer NOT NULL,
          "_locale" "enum_pages_locales_locale" NOT NULL,
          "title" varchar NOT NULL,
          "layout" jsonb NOT NULL,
          "meta_title" varchar,
          "meta_description" varchar
        );

        ALTER TABLE "pages_locales"
          ADD CONSTRAINT "pages_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id")
          ON DELETE cascade ON UPDATE no action;

        CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique"
          ON "pages_locales" USING btree ("_locale", "_parent_id");
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages_locales' AND column_name = 'layout'
      ) AND EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'layout'
      ) THEN
        INSERT INTO "pages_locales" ("_parent_id", "_locale", "title", "layout", "meta_title", "meta_description")
        SELECT p."id", 'de'::"enum_pages_locales_locale", p."title", p."layout", p."meta_title", p."meta_description"
        FROM "pages" p
        WHERE p."title" IS NOT NULL
          AND p."layout" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM "pages_locales" pl
            WHERE pl."_parent_id" = p."id" AND pl."_locale" = 'de'
          );
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'title'
      ) THEN
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "title";
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'layout'
      ) THEN
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "layout";
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'meta_title'
      ) THEN
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_title";
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'pages' AND column_name = 'meta_description'
      ) THEN
        ALTER TABLE "pages" DROP COLUMN IF EXISTS "meta_description";
      END IF;

      -- Menü-Labels
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_main_menu_items_locales_locale') THEN
        CREATE TYPE "public"."enum_main_menu_items_locales_locale" AS ENUM('de', 'en');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'main_menu_items_locales') THEN
        CREATE TABLE "main_menu_items_locales" (
          "id" serial PRIMARY KEY NOT NULL,
          "_parent_id" varchar NOT NULL,
          "_locale" "enum_main_menu_items_locales_locale" NOT NULL,
          "label" varchar NOT NULL
        );

        ALTER TABLE "main_menu_items_locales"
          ADD CONSTRAINT "main_menu_items_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_items"("id")
          ON DELETE cascade ON UPDATE no action;

        CREATE UNIQUE INDEX "main_menu_items_locales_locale_parent_id_unique"
          ON "main_menu_items_locales" USING btree ("_locale", "_parent_id");
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'main_menu_items' AND column_name = 'label'
      ) THEN
        INSERT INTO "main_menu_items_locales" ("_parent_id", "_locale", "label")
        SELECT m."id", 'de'::"enum_main_menu_items_locales_locale", m."label"
        FROM "main_menu_items" m
        WHERE m."label" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM "main_menu_items_locales" ml
            WHERE ml."_parent_id" = m."id" AND ml."_locale" = 'de'
          );

        ALTER TABLE "main_menu_items" DROP COLUMN IF EXISTS "label";
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_main_menu_items_children_locales_locale') THEN
        CREATE TYPE "public"."enum_main_menu_items_children_locales_locale" AS ENUM('de', 'en');
      END IF;

      IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'main_menu_items_children_locales') THEN
        CREATE TABLE "main_menu_items_children_locales" (
          "id" serial PRIMARY KEY NOT NULL,
          "_parent_id" varchar NOT NULL,
          "_locale" "enum_main_menu_items_children_locales_locale" NOT NULL,
          "label" varchar NOT NULL
        );

        ALTER TABLE "main_menu_items_children_locales"
          ADD CONSTRAINT "main_menu_items_children_locales_parent_id_fk"
          FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_items_children"("id")
          ON DELETE cascade ON UPDATE no action;

        CREATE UNIQUE INDEX "main_menu_items_children_locales_locale_parent_id_unique"
          ON "main_menu_items_children_locales" USING btree ("_locale", "_parent_id");
      END IF;

      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'main_menu_items_children' AND column_name = 'label'
      ) THEN
        INSERT INTO "main_menu_items_children_locales" ("_parent_id", "_locale", "label")
        SELECT m."id", 'de'::"enum_main_menu_items_children_locales_locale", m."label"
        FROM "main_menu_items_children" m
        WHERE m."label" IS NOT NULL
          AND NOT EXISTS (
            SELECT 1 FROM "main_menu_items_children_locales" ml
            WHERE ml."_parent_id" = m."id" AND ml."_locale" = 'de'
          );

        ALTER TABLE "main_menu_items_children" DROP COLUMN IF EXISTS "label";
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`SELECT 1`)
}
