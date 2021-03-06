# Migration `20200821144424-category`

This migration has been generated by Ebuka Umeh at 8/21/2020, 3:44:24 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'FRENCH', 'GERMANY');

CREATE TABLE "public"."Location" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"country" text  NOT NULL ,
"city" text  NOT NULL ,
"currency" text  NOT NULL ,
"language" "Language"[]  ,
"userId" integer   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Category" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"description" text  NOT NULL ,
"name" text  NOT NULL ,
"profile" text  NOT NULL ,
"foodId" integer   ,
PRIMARY KEY ("id"))

ALTER TABLE "public"."Food" DROP COLUMN "category";

ALTER TABLE "public"."Location" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Category" ADD FOREIGN KEY ("foodId")REFERENCES "public"."Food"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200821132534-food..20200821144424-category
--- datamodel.dml
+++ datamodel.dml
@@ -1,8 +1,8 @@
 // 1
 datasource db {
   provider = "postgresql" 
-  url = "***"
+  url = "***"
 }
 // 2
 generator client {
@@ -33,8 +33,9 @@
   phone    String?
   whatsapp String?
   role  Role  @default(USER)
   seller Boolean @default(false)
+  location Location[]
 }
 model Food {
   id          Int      @id @default(autoincrement())
@@ -44,15 +45,34 @@
   profile String 
   profiles String[]
   price  String 
   discountprice   String
-  category Int[]
+  category Category[]
   liters Int @default(2)
   order Order[]
   postedBy    User?     @relation(fields: [postedById], references: [id])
   postedById  Int?
 }
+model Location {
+  id          Int      @id @default(autoincrement())
+  createdAt   DateTime @default(now())
+  country String 
+  city String 
+  currency String 
+  language Language[]
+}
+
+model Category {
+  id          Int      @id @default(autoincrement())
+  createdAt   DateTime @default(now())
+  description String
+  name String
+  profile String 
+  food    Food?     @relation(fields: [foodId], references: [id])
+  foodId  Int?
+}
+
 model Order {
   id          Int      @id @default(autoincrement())
   createdAt   DateTime @default(now())
   description String?
@@ -92,5 +112,11 @@
   PROGRESS 
   COMPLETED
   DELIVERED
   CANCELLED
+}
+
+enum Language {
+  ENGLISH 
+  FRENCH 
+  GERMANY
 }
```


