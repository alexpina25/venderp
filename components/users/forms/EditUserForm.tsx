"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUser } from "@/app/actions/updateUser";
import { toast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    id: z.string(),
    name: z.string().min(2),
    role: z.enum([
      "TENANT_ADMIN",
      "TENANT_USER",
      "CENTER_MANAGER",
      "CENTER_USER",
      "POS_USER",
    ]),
    active: z.boolean(),
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
    message: "PDV requerido",
    path: ["posId"],
  });

interface Props {
  user: {
    id: string;
    name: string;
    role: string;
    active: boolean;
    center?: { id: string; name: string } | null;
    pos?: { id: string; name: string } | null;
  };
  onSuccess?: () => void;
}

export function EditUserForm({ user, onSuccess }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user.id,
      name: user.name,
      role: user.role as any,
      active: user.active,
      centerId: user.center?.id,
      posId: user.pos?.id,
    },
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
    await updateUser(values);
    toast({ title: "Usuario actualizado" });
    router.refresh();
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />

      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} />
        {errors.name && (
          <p className="text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>
        <Label className="flex items-center gap-2">
          Activo
          <Switch
            checked={watch("active")}
            onCheckedChange={(v) => setValue("active", v)}
          />
        </Label>
      <div>
        <Label>Rol</Label>
        <Select
          onValueChange={(v) => setValue("role", v as any)}
          defaultValue={user.role}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TENANT_ADMIN">Administrador</SelectItem>
            <SelectItem value="TENANT_USER">Usuario</SelectItem>
            <SelectItem value="CENTER_MANAGER">Manager de centro</SelectItem>
            <SelectItem value="CENTER_USER">Usuario de centro</SelectItem>
            <SelectItem value="POS_USER">Usuario PDV</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {(role === "CENTER_MANAGER" || role === "CENTER_USER") && (
        <div>
          <Label>Centro</Label>
          <Select
            onValueChange={(v) => setValue("centerId", v)}
            defaultValue={user.center?.id}
          >
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
          <Label>PDV</Label>
          <Select
            onValueChange={(v) => setValue("posId", v)}
            defaultValue={user.pos?.id}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona PDV" />
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
        Guardar cambios
      </Button>
    </form>
  );
}
