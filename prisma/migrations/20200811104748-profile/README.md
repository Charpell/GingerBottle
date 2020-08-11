# Migration `20200811104748-profile`

This migration has been generated at 8/11/2020, 11:47:48 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"name" TEXT NOT NULL,
"email" TEXT NOT NULL,
"password" TEXT NOT NULL,
"profile" TEXT NOT NULL)

INSERT INTO "new_User" ("id", "name", "email", "password") SELECT "id", "name", "email", "password" FROM "User"

PRAGMA foreign_keys=off;
DROP TABLE "User";;
PRAGMA foreign_keys=on

ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811104343-add-trip-model..20200811104748-profile
--- datamodel.dml
+++ datamodel.dml
@@ -1,8 +1,8 @@
 // 1
 datasource db {
   provider = "sqlite" 
-  url = "***"
+  url = "***"
 }
 // 2
 generator client {
@@ -27,8 +27,9 @@
   password String
   links    Link[]
   votes    Vote[]
   trips    Trip[]
+  profile  String
 }
 model Vote {
   id     Int  @id @default(autoincrement())
```


