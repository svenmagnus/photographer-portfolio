import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  DELETE FROM "payload_preferences"
  WHERE "key" IN ('collection-blog-posts', 'blog-posts-list');`)
}

export async function down(): Promise<void> {
  // Preferences cannot be restored once deleted.
}
