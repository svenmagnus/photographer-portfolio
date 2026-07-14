import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_main_menu_items_link_type" AS ENUM('page', 'category', 'external');
  CREATE TYPE "public"."enum_main_menu_items_category" AS ENUM('hollywood', 'fashion-clicks', 'black-white', 'beauty-pics', 'runway', 'miscellaneous', 'alaia-collection', 'advertorial', 'film-editor', 'motion', 'insta', 'publications');
  CREATE TYPE "public"."enum_main_menu_items_children_link_type" AS ENUM('page', 'category', 'external');
  CREATE TYPE "public"."enum_main_menu_items_children_category" AS ENUM('hollywood', 'fashion-clicks', 'black-white', 'beauty-pics', 'runway', 'miscellaneous', 'alaia-collection', 'advertorial', 'film-editor', 'motion', 'insta', 'publications');

  CREATE TABLE "main_menu" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  CREATE TABLE "main_menu_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_main_menu_items_link_type" DEFAULT 'page' NOT NULL,
  	"category" "enum_main_menu_items_category",
  	"page_id" integer,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );

  CREATE TABLE "main_menu_items_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_main_menu_items_children_link_type" DEFAULT 'page' NOT NULL,
  	"category" "enum_main_menu_items_children_category",
  	"page_id" integer,
  	"url" varchar,
  	"open_in_new_tab" boolean DEFAULT false
  );

  ALTER TABLE "main_menu_items" ADD CONSTRAINT "main_menu_items_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_menu_items" ADD CONSTRAINT "main_menu_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "main_menu_items_children" ADD CONSTRAINT "main_menu_items_children_page_id_pages_id_fk" FOREIGN KEY ("page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "main_menu_items_children" ADD CONSTRAINT "main_menu_items_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_menu_items"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "main_menu_items_order_idx" ON "main_menu_items" USING btree ("_order");
  CREATE INDEX "main_menu_items_parent_id_idx" ON "main_menu_items" USING btree ("_parent_id");
  CREATE INDEX "main_menu_items_page_idx" ON "main_menu_items" USING btree ("page_id");
  CREATE INDEX "main_menu_items_children_order_idx" ON "main_menu_items_children" USING btree ("_order");
  CREATE INDEX "main_menu_items_children_parent_id_idx" ON "main_menu_items_children" USING btree ("_parent_id");
  CREATE INDEX "main_menu_items_children_page_idx" ON "main_menu_items_children" USING btree ("page_id");

  INSERT INTO "main_menu" ("updated_at", "created_at") VALUES (now(), now());`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "main_menu_items_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "main_menu_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "main_menu" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "main_menu_items_children" CASCADE;
  DROP TABLE "main_menu_items" CASCADE;
  DROP TABLE "main_menu" CASCADE;
  DROP TYPE "public"."enum_main_menu_items_children_category";
  DROP TYPE "public"."enum_main_menu_items_children_link_type";
  DROP TYPE "public"."enum_main_menu_items_category";
  DROP TYPE "public"."enum_main_menu_items_link_type";`)
}
