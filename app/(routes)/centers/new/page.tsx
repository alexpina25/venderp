import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NewCenterForm } from "@/components/centers/forms/NewCenterForm";

export default function NewCenterPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-2">
        <Button asChild variant="default" size="icon">
          <Link href="/centers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-2xl font-bold">Registrar nuevo centro</h2>
      </div>

      <div className="bg-background rounded-lg p-4 border">
        <NewCenterForm />
      </div>
    </div>
  );
}