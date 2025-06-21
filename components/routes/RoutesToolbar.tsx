"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Operator = { id: string; name: string };

export function RoutesToolbar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [operators, setOperators] = useState<Operator[]>([]);

  useEffect(() => {
    fetch("/api/users?role=TENANT_USER")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setOperators(data);
      });
  }, []);

  const dateValue =
    searchParams.get("date") ?? new Date().toISOString().substring(0, 10);
  const operatorValue = searchParams.get("operator") ?? "";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/routes?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-end gap-2">
      <Input
        type="date"
        className="w-full sm:w-auto"
        defaultValue={dateValue}
        onChange={(e) => updateParam("date", e.target.value)}
      />
      <Select
        defaultValue={operatorValue || undefined}
        onValueChange={(v) => updateParam("operator", v)}
      >
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Operador" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos</SelectItem>
          {operators.map((op) => (
            <SelectItem key={op.id} value={op.id}>
              {op.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href="/routes/new">+ Nueva ruta</Link>
      </Button>
    </div>
  );
}
