import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewRouteForm } from "@/components/routes/forms/NewRouteForm";

export default function NewRoutePage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <Button asChild size="icon">
          <Link href="/routes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Programar nueva ruta</h2>
      </div>
      <div className="bg-background rounded-lg p-4 border mt-4">
        <NewRouteForm />
      </div>
    </div>
  );
}