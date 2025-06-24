import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewMachineForm } from "@/components/machines/forms/NewMachineForm";

export default function NewMachinePage() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/machines">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Registrar nueva máquina</h2>
      </div>

      <div className="bg-background rounded-lg p-4 border mt-4">
        <NewMachineForm />
      </div>
    </div>
  );
}
