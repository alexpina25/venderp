import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MachineWithProducts } from "../MachineDetailsTabs";
import { ChannelConfigurator } from "./ChannelConfigurator";

interface Props {
  machine: MachineWithProducts;
  open: boolean;
  onClose: () => void;
}

export function ChannelConfiguratorModal({ machine, open, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Configurar canales</DialogTitle>
        </DialogHeader>
        <ChannelConfigurator machine={machine} />
      </DialogContent>
    </Dialog>
  );
}
