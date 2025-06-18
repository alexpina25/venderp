"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

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

const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(4),
  role: z.enum(["TENANT_ADMIN", "TENANT_USER"]),
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
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { role: "TENANT_USER" },
  });

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
          onValueChange={(v) =>
            setValue("role", v as "TENANT_ADMIN" | "TENANT_USER")
          }
          defaultValue="TENANT_USER"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TENANT_ADMIN">Administrador</SelectItem>
            <SelectItem value="TENANT_USER">Usuario</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Crear usuario
      </Button>
    </form>
  );
}
