# Migration `20200811094650-add-vote-model`

This migration has been generated at 8/11/2020, 10:46:50 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "Vote" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"linkId" INTEGER NOT NULL,
"userId" INTEGER NOT NULL,
FOREIGN KEY ("linkId") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE,

FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
)

CREATE UNIQUE INDEX "Vote.linkId_userId_unique" ON "Vote"("linkId","userId")

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811091825-init..20200811094650-add-vote-model
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
@@ -14,15 +14,27 @@
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   description String
   url         String
-  postedBy    User?    @relation(fields: [postedById], references: [id])
+  postedBy    User?     @relation(fields: [postedById], references: [id])
   postedById  Int?
+  votes       Vote[]
 }
 model User {
-  id        Int      @id @default(autoincrement())
-  name      String
-  email     String   @unique
-  password  String
-  links     Link[]
-}
+  id       Int    @id @default(autoincrement())
+  name     String
+  email    String @unique
+  password String
+  links    Link[]
+  votes    Vote[]
+}
+
+model Vote {
+  id     Int  @id @default(autoincrement())
+  link   Link @relation(fields: [linkId], references: [id])
+  linkId Int
+  user   User @relation(fields: [userId], references: [id])
+  userId Int
+
+  @@unique([linkId, userId])
+}
```


