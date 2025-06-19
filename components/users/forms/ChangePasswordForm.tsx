"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { changeUserPassword } from "@/app/actions/changeUserPassword";
import { toast } from "@/components/ui/use-toast";

const formSchema = z
  .object({
    id: z.string(),
    password: z.string().min(4),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Las contraseñas no coinciden",
    path: ["confirm"],
  });

interface Props {
  userId: string;
  onSuccess?: () => void;
}

export function ChangePasswordForm({ userId, onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { id: userId },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await changeUserPassword({ id: values.id, password: values.password });
    toast({ title: "Contraseña actualizada" });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("id")} />
      <div>
        <Label htmlFor="password">Nueva contraseña</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="confirm">Confirmar contraseña</Label>
        <Input id="confirm" type="password" {...register("confirm")} />
        {errors.confirm && (
          <p className="text-xs text-red-500">{errors.confirm.message}</p>
        )}
      </div>
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  );
}
