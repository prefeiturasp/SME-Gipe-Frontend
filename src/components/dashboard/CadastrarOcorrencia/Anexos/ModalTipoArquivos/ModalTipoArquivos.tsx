"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ImageFile from "@/assets/icons/ImageFile";
import OpenedFiles from "@/assets/icons/OpenedFiles";
import VideoFile from "@/assets/icons/VideoFile";
import ClosedFiles from "@/assets/icons/ClosedFiles";


import { Button } from "@/components/ui/button";
import Aviso from "@/components/login/FormCadastro/Aviso";

type TipoArquivoCardProps = Readonly<{
  icon: React.ReactNode;
  titulo: string;
  extensoes: string;
}>;

function TipoArquivoCard({ icon, titulo, extensoes }: TipoArquivoCardProps) {
  return (
    <div className="flex flex-col justify-between w-[150px] h-[108px] border border-[#dadada] rounded-[4px] p-4">
      <div>{icon}</div>
      <div>
        <p className="text-[14px] font-[700] text-[#42474a] whitespace-nowrap">{titulo}</p>
        <p className="text-[14px] text-[#6B6B6B]">{extensoes}</p>
      </div>
    </div>
  );
}

type ModalTipoArquivosProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
};

export default function ModalTipoArquivos({
  open,
  onOpenChange,
}: Readonly<ModalTipoArquivosProps>) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-[700px] p-8 rounded-[4px]">
            <DialogHeader>
                <DialogTitle>Formatos e tamanhos suportados</DialogTitle>
            </DialogHeader>
            <DialogDescription>
                Confira os formatos permitidos
            </DialogDescription>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 justify-items-center">
                <TipoArquivoCard
                icon={<ImageFile className="w-6 h-6 text-[#717FC7]" />}
                titulo="Imagens"
                extensoes=".jpeg, .jgp e .png"
                />
                <TipoArquivoCard
                icon={<VideoFile className="w-6 h-6 text-[#717FC7]" />}
                titulo="Vídeos"
                extensoes=".mp4"
                />
                <TipoArquivoCard
                icon={<ClosedFiles className="w-6 h-6 text-[#717FC7]" />}
                titulo="Arquivos fechados"
                extensoes=".PDF"
                />
                <TipoArquivoCard
                icon={<OpenedFiles className="w-6 h-6 text-[#717FC7]" />}
                titulo="Arquivos abertos"
                extensoes=".xlsx, .docx, .txt"
                />
            </div>
            
            <Aviso>
                O tamanho total dos arquivos não pode ultrapassar 10MB. Caso exceda esse limite,a ocorrência não será enviada.
            </Aviso>

            <div className="flex justify-end mt-6">
              <Button
                size="sm"
                className="rounded-[4px] text-[14px] font-[700] bg-[#717FC7] text-white hover:bg-[#5a65a8]"
                onClick={() => onOpenChange(false)}
              >
                Fechar
              </Button>
            </div>
      </DialogContent>
    </Dialog>
  );
}
