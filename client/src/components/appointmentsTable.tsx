import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Button } from "./ui/button";
import type { Appointment } from "@/types";

interface AppointmentsTableProps {
  appointments?: Record<string, Appointment[]>;
}

function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {appointments ? (
            Object.keys(appointments).map((day) => (
              <TableHead key={day}>{day}</TableHead>
            ))
          ) : (
            <TableHead>No available appointments</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          {appointments
            ? Object.keys(appointments).map((day) => (
                <TableCell key={day}>
                  {appointments[day].map((appt) => (
                    <Button key={appt.id} variant="outline" size="sm">
                      {new Date(appt.datetime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Button>
                  ))}
                </TableCell>
              ))
            : null}
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default AppointmentsTable;
