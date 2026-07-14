import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "blog_posts_rels" (
    "id" serial PRIMARY KEY NOT NULL,
    "order" integer,
    "parent_id" integer NOT NULL,
    "path" varchar NOT NULL,
    "media_id" integer
  );

  DO $$ BEGIN
    ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  DO $$ BEGIN
    ALTER TABLE "blog_posts_rels" ADD CONSTRAINT "blog_posts_rels_media_fk"
      FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  CREATE INDEX IF NOT EXISTS "blog_posts_rels_order_idx" ON "blog_posts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_parent_idx" ON "blog_posts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_path_idx" ON "blog_posts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "blog_posts_rels_media_id_idx" ON "blog_posts_rels" USING btree ("media_id");

  INSERT INTO "blog_posts_rels" ("order", "parent_id", "path", "media_id")
  SELECT 1, "id", 'featuredImage', "featured_image_id"
  FROM "blog_posts"
  WHERE "featured_image_id" IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM "blog_posts_rels"
      WHERE "parent_id" = "blog_posts"."id" AND "path" = 'featuredImage'
    );

  ALTER TABLE "blog_posts" DROP CONSTRAINT IF EXISTS "blog_posts_featured_image_id_media_id_fk";
  DROP INDEX IF EXISTS "blog_posts_featured_image_idx";
  ALTER TABLE "blog_posts" DROP COLUMN IF EXISTS "featured_image_id";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "blog_posts" ADD COLUMN IF NOT EXISTS "featured_image_id" integer;

  DO $$ BEGIN
    ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk"
      FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN NULL;
  END $$;

  CREATE INDEX IF NOT EXISTS "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");

  UPDATE "blog_posts" AS bp
  SET "featured_image_id" = rel."media_id"
  FROM (
    SELECT DISTINCT ON ("parent_id") "parent_id", "media_id"
    FROM "blog_posts_rels"
    WHERE "path" = 'featuredImage' AND "media_id" IS NOT NULL
    ORDER BY "parent_id", "order" ASC NULLS LAST, "id" ASC
  ) AS rel
  WHERE bp."id" = rel."parent_id";

  DROP TABLE IF EXISTS "blog_posts_rels" CASCADE;`)
}
