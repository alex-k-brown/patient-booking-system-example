CREATE TYPE "public"."appointment_status" AS ENUM('scheduled', 'completed', 'available');--> statement-breakpoint
CREATE TYPE "public"."appointment_type" AS ENUM('wellness', 'sick', 'follow-up');--> statement-breakpoint
CREATE TABLE "appointments" (
	"id" text PRIMARY KEY NOT NULL,
	"patient_id" text,
	"provider_id" text NOT NULL,
	"datetime" timestamp with time zone NOT NULL,
	"reason" text NOT NULL,
	"status" "appointment_status" NOT NULL,
	"type" "appointment_type" NOT NULL,
	"virtual" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "patients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "providers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"specialty" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_patient_id_patients_id_fk" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_provider_id_providers_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("id") ON DELETE no action ON UPDATE no action;