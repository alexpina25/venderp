"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTenantUser } from "@/app/actions/createTenantUser";
import { toast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    email: z.string().email(),
    name: z.string().min(2),
    password: z.string().min(4),
    role: z.enum([
      "TENANT_ADMIN",
      "TENANT_USER",
      "CENTER_MANAGER",
      "CENTER_USER",
      "POS_USER",
    ]),
    centerId: z.string().optional(),
    posId: z.string().optional(),
  })
  .refine(
    (data) =>
      !["CENTER_MANAGER", "CENTER_USER"].includes(data.role) || !!data.centerId,
    {
      message: "Centro requerido",
      path: ["centerId"],
    }
  )
  .refine((data) => data.role !== "POS_USER" || !!data.posId, {
    message: "POS requerido",
    path: ["posId"],
  });

export function NewUserForm() {
  const router = useRouter();
  const { data: session } = useSession() as {
    data: { user?: { tenant?: { id: string } } };
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "TENANT_USER" },
  });

  const role = watch("role");

  const [centers, setCenters] = useState<{ id: string; name: string }[]>([]);
  const [posList, setPosList] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    if (role === "CENTER_MANAGER" || role === "CENTER_USER") {
      setValue("posId", undefined);
      fetch("/api/centers?all=true")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setCenters(data);
        });
    } else if (role === "POS_USER") {
      setValue("centerId", undefined);
      fetch("/api/pos")
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setPosList(data);
        });
    } else {
      setValue("centerId", undefined);
      setValue("posId", undefined);
    }
  }, [role, setValue]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const tenantId = session?.user?.tenant?.id;
    if (!tenantId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se encontró tenant",
      });
      return;
    }
    await createTenantUser({ ...values, tenantId });
    toast({ title: "Usuario creado" });
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Usuario</Label>
        <Input id="email" {...register("email")} />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label>Rol</Label>
        <Select
          onValueChange={(v) => setValue("role", v as any)}
          defaultValue="TENANT_USER"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TENANT_ADMIN">Administrador</SelectItem>
            <SelectItem value="TENANT_USER">Usuario</SelectItem>
            <SelectItem value="CENTER_MANAGER">Manager de centro</SelectItem>
            <SelectItem value="CENTER_USER">Usuario de centro</SelectItem>
            <SelectItem value="POS_USER">Usuario POS</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(role === "CENTER_MANAGER" || role === "CENTER_USER") && (
        <div>
          <Label>Centro</Label>
          <Select onValueChange={(v) => setValue("centerId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona centro" />
            </SelectTrigger>
            <SelectContent>
              {centers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.centerId && (
            <p className="text-xs text-red-500 mt-1">
              {errors.centerId.message}
            </p>
          )}
        </div>
      )}

      {role === "POS_USER" && (
        <div>
          <Label>POS</Label>
          <Select onValueChange={(v) => setValue("posId", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona POS" />
            </SelectTrigger>
            <SelectContent>
              {posList.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.posId && (
            <p className="text-xs text-red-500 mt-1">{errors.posId.message}</p>
          )}
        </div>
      )}
      <Button type="submit" disabled={isSubmitting}>
        Crear usuario
      </Button>
    </form>
  );
}
