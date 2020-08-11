# Migration `20200811091825-init`

This migration has been generated at 8/11/2020, 10:18:25 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "User" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"name" TEXT NOT NULL,
"email" TEXT NOT NULL,
"password" TEXT NOT NULL)

ALTER TABLE "Link" ADD COLUMN "postedById" INTEGER ;

CREATE UNIQUE INDEX "User.email_unique" ON "User"("email")

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811085510-init..20200811091825-init
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
@@ -14,5 +14,15 @@
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   description String
   url         String
+  postedBy    User?    @relation(fields: [postedById], references: [id])
+  postedById  Int?
+}
+
+model User {
+  id        Int      @id @default(autoincrement())
+  name      String
+  email     String   @unique
+  password  String
+  links     Link[]
 }
```


