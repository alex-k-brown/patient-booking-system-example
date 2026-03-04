import { pgTable, text, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "scheduled",
  "completed",
  "selected",
  "available",
]);

export const appointmentTypeEnum = pgEnum("appointment_type", [
  "wellness",
  "sick",
  "follow-up",
]);

export const providers = pgTable("providers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
});

export const patients = pgTable("patients", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
});

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  patientId: text("patient_id").references(() => patients.id),
  providerId: text("provider_id")
    .notNull()
    .references(() => providers.id),
  datetime: timestamp("datetime", { withTimezone: true }).notNull(),
  reason: text("reason").notNull(),
  status: appointmentStatusEnum("status").notNull(),
  type: appointmentTypeEnum("type").notNull(),
  virtual: boolean("virtual").notNull(),
});
