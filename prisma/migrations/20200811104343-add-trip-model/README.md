# Migration `20200811104343-add-trip-model`

This migration has been generated at 8/11/2020, 11:43:43 AM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;

CREATE TABLE "Trip" (
"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
"createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
"tripId" INTEGER ,
"distance" REAL NOT NULL,
"destinationLatitude" REAL NOT NULL,
"destinationLongitude" REAL NOT NULL,
"startAddress" TEXT NOT NULL,
"startLatitude" REAL NOT NULL,
"startLongitude" REAL NOT NULL,
"estimatedTime" TEXT NOT NULL,
"destinationAddress" TEXT NOT NULL,
FOREIGN KEY ("tripId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

PRAGMA foreign_key_check;

PRAGMA foreign_keys=ON;
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811094650-add-vote-model..20200811104343-add-trip-model
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
@@ -26,8 +26,9 @@
   email    String @unique
   password String
   links    Link[]
   votes    Vote[]
+  trips    Trip[]
 }
 model Vote {
   id     Int  @id @default(autoincrement())
@@ -37,4 +38,19 @@
   userId Int
   @@unique([linkId, userId])
 }
+
+model Trip {
+  id Int @id @default(autoincrement())
+  createdAt DateTime @default(now())
+  postedBy User? @relation(fields: [tripId], references: [id])
+  tripId Int?
+  distance Float 
+  destinationLatitude Float
+  destinationLongitude Float 
+  startAddress String
+  startLatitude Float
+  startLongitude Float
+  estimatedTime String 
+  destinationAddress String
+}
```


