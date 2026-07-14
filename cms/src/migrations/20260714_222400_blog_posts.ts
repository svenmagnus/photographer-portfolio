import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TYPE "public"."enum_blog_posts_status" AS ENUM('draft', 'published');

  CREATE TABLE "blog_posts" (
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar NOT NULL,
    "slug" varchar NOT NULL,
    "blog_page_id" integer NOT NULL,
    "status" "enum_blog_posts_status" DEFAULT 'draft' NOT NULL,
    "published_at" timestamp(3) with time zone,
    "featured_image_id" integer,
    "excerpt" varchar,
    "content" jsonb NOT NULL,
    "meta_title" varchar,
    "meta_description" varchar,
    "updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
    "created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );

  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_blog_page_id_pages_id_fk" FOREIGN KEY ("blog_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "blog_posts" ADD CONSTRAINT "blog_posts_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;

  CREATE UNIQUE INDEX "blog_posts_slug_idx" ON "blog_posts" USING btree ("slug");
  CREATE INDEX "blog_posts_blog_page_idx" ON "blog_posts" USING btree ("blog_page_id");
  CREATE INDEX "blog_posts_featured_image_idx" ON "blog_posts" USING btree ("featured_image_id");
  CREATE INDEX "blog_posts_updated_at_idx" ON "blog_posts" USING btree ("updated_at");
  CREATE INDEX "blog_posts_created_at_idx" ON "blog_posts" USING btree ("created_at");

  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "blog_posts_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_posts_fk" FOREIGN KEY ("blog_posts_id") REFERENCES "public"."blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_posts_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_blog_posts_fk";
  DROP INDEX "payload_locked_documents_rels_blog_posts_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "blog_posts_id";

  ALTER TABLE "blog_posts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "blog_posts" CASCADE;
  DROP TYPE "public"."enum_blog_posts_status";`)
}
