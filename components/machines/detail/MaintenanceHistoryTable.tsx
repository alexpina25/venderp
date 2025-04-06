"use client";

import { MaintenanceLog } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";

interface Props {
  machineId: string;
}

export function MaintenanceHistoryTable({ machineId }: Props) {
  const [maintenanceLogs, setMaintenanceLogs] = useState<MaintenanceLog[]>([]);

  useEffect(() => {
    async function fetchMaintenanceLogs() {
      const response = await fetch(`/api/maintenance/${machineId}`);
      const data = await response.json();
      setMaintenanceLogs(data);
    }

    fetchMaintenanceLogs();
  }, [machineId]);

  return (
    <div>
      <Table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Tipo</th>
            <th>Descripción</th>
          </tr>
        </thead>
        <tbody>
          {maintenanceLogs.map((log) => (
            <tr key={log.id}>
              <td>{new Date(log.date).toLocaleDateString()}</td>
              <td>{log.type}</td>
              <td>{log.description}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
