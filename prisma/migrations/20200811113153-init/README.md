# Migration `20200811113153-init`

This migration has been generated at 8/11/2020, 12:31:53 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "public"."Link" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"description" text  NOT NULL ,
"url" text  NOT NULL ,
"postedById" integer   ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."User" (
"id" SERIAL,
"name" text  NOT NULL ,
"email" text  NOT NULL ,
"password" text  NOT NULL ,
"profile" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Vote" (
"id" SERIAL,
"linkId" integer  NOT NULL ,
"userId" integer  NOT NULL ,
PRIMARY KEY ("id"))

CREATE TABLE "public"."Trip" (
"id" SERIAL,
"createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
"tripId" integer   ,
"distance" Decimal(65,30)  NOT NULL ,
"destinationLatitude" Decimal(65,30)  NOT NULL ,
"destinationLongitude" Decimal(65,30)  NOT NULL ,
"startAddress" text  NOT NULL ,
"startLatitude" Decimal(65,30)  NOT NULL ,
"startLongitude" Decimal(65,30)  NOT NULL ,
"estimatedTime" text  NOT NULL ,
"destinationAddress" text  NOT NULL ,
PRIMARY KEY ("id"))

CREATE UNIQUE INDEX "User.email_unique" ON "public"."User"("email")

CREATE UNIQUE INDEX "Vote.linkId_userId_unique" ON "public"."Vote"("linkId","userId")

ALTER TABLE "public"."Link" ADD FOREIGN KEY ("postedById")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE

ALTER TABLE "public"."Vote" ADD FOREIGN KEY ("linkId")REFERENCES "public"."Link"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Vote" ADD FOREIGN KEY ("userId")REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE

ALTER TABLE "public"."Trip" ADD FOREIGN KEY ("tripId")REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20200811104748-profile..20200811113153-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,8 +1,8 @@
 // 1
 datasource db {
-  provider = "sqlite" 
-  url = "***"
+  provider = "postgresql" 
+  url = "***"
 }
 // 2
 generator client {
```


