import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_gallery_category" AS ENUM('hollywood', 'fashion-clicks', 'black-white', 'beauty-pics', 'runway', 'miscellaneous', 'alaia-collection', 'advertorial', 'film-editor', 'motion', 'insta', 'publications');
  ALTER TABLE "pages" ADD COLUMN "gallery_category" "enum_pages_gallery_category";
  ALTER TABLE "pages" ADD COLUMN "nav_order" numeric DEFAULT 100;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages" DROP COLUMN "gallery_category";
  ALTER TABLE "pages" DROP COLUMN "nav_order";
  DROP TYPE "public"."enum_pages_gallery_category";`)
}
