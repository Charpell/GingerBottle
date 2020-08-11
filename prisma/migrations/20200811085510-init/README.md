# Migration `20200811085510-init`

This migration has been generated at 8/11/2020, 9:55:10 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "Link" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
"description" TEXT NOT NULL,
"url" TEXT NOT NULL)

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200811085510-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,18 @@
+// 1
+datasource db {
+  provider = "sqlite" 
+  url = "***"
+}
+
+// 2
+generator client {
+  provider = "prisma-client-js"
+}
+
+// 3
+model Link {
+  id          Int      @id @default(autoincrement())
+  createdAt   DateTime @default(now())
+  description String
+  url         String
+}
```


