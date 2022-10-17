
-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL
);

-- Above is provided by EDA | Below is generated from DBDesigner

CREATE TABLE "user" (
	"id" serial NOT NULL,
	"username" varchar(80) NOT NULL UNIQUE,
	"password" varchar(1000) NOT NULL,
	"first_name" varchar(80) NOT NULL,
	"last_name" varchar(80) NOT NULL,
	"email" varchar(80) NOT NULL,
	CONSTRAINT "user_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "user_account" (
	"id" serial NOT NULL,
	"user_id" bigint NOT NULL,
	"organization_id" bigint NOT NULL,
	"is_admin" BOOLEAN NOT NULL DEFAULT 'false',
	"title_id" bigint NOT NULL,
	CONSTRAINT "user_account_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "organizations_types" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	CONSTRAINT "organizations_types_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "organizations" (
	"id" serial NOT NULL,
	"name" TEXT NOT NULL UNIQUE,
	"type_id" int NOT NULL,
	CONSTRAINT "organizations_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "resources" (
	"id" serial NOT NULL,
	"file_name" TEXT NOT NULL,
	"date_created" DATE NOT NULL DEFAULT NOW(),
	"file_type" integer NOT NULL,
	"created_by_id" bigint NOT NULL,
	"organization_id" bigint NOT NULL,
	CONSTRAINT "resources_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "events" (
	"id" serial NOT NULL,
	"event_name" varchar(255) NOT NULL,
	"date_created" DATE NOT NULL DEFAULT NOW(),
	"start_event" DATE NOT NULL,
	"organization_id" bigint NOT NULL,
	CONSTRAINT "events_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "titles" (
	"id" serial NOT NULL,
	"title_name" varchar(80) NOT NULL,
	"organization_id" bigint NOT NULL,
	CONSTRAINT "titles_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "messages" (
	"id" serial NOT NULL,
	"message" varchar(1000) NOT NULL,
	"date_sent" DATE NOT NULL DEFAULT NOW(),
	"user_sent_id" bigint NOT NULL,
	"organization_id" bigint NOT NULL,
	CONSTRAINT "messages_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "events_participants" (
	"id" serial NOT NULL,
	"event_id" bigint NOT NULL,
	"user_account_id" bigint NOT NULL,
	"event_duty" varchar(80) NOT NULL,
	CONSTRAINT "events_participants_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);



CREATE TABLE "blackout_dates" (
	"id" serial NOT NULL,
	"user_account_id" bigint NOT NULL,
	"unavailable_date" DATE NOT NULL,
	CONSTRAINT "blackout_dates_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);




ALTER TABLE "user_account" ADD CONSTRAINT "user_account_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id");
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_fk1" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");
ALTER TABLE "user_account" ADD CONSTRAINT "user_account_fk2" FOREIGN KEY ("title_id") REFERENCES "titles"("id");


ALTER TABLE "organizations" ADD CONSTRAINT "organizations_fk0" FOREIGN KEY ("type_id") REFERENCES "organizations_types"("id");

ALTER TABLE "resources" ADD CONSTRAINT "resources_fk0" FOREIGN KEY ("created_by_id") REFERENCES "user_account"("id");
ALTER TABLE "resources" ADD CONSTRAINT "resources_fk1" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");

ALTER TABLE "events" ADD CONSTRAINT "events_fk0" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");

ALTER TABLE "titles" ADD CONSTRAINT "titles_fk0" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");

ALTER TABLE "messages" ADD CONSTRAINT "messages_fk0" FOREIGN KEY ("user_sent_id") REFERENCES "user_account"("id");
ALTER TABLE "messages" ADD CONSTRAINT "messages_fk1" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id");

ALTER TABLE "events_participants" ADD CONSTRAINT "events_participants_fk0" FOREIGN KEY ("event_id") REFERENCES "events"("id");
ALTER TABLE "events_participants" ADD CONSTRAINT "events_participants_fk1" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id");

ALTER TABLE "blackout_dates" ADD CONSTRAINT "blackout_dates_fk0" FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id");
