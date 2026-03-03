ALTER TABLE "patients" ADD CONSTRAINT "patients_email_unique" UNIQUE("email");--> statement-breakpoint
ALTER TABLE "patients" ADD CONSTRAINT "patients_phone_unique" UNIQUE("phone");