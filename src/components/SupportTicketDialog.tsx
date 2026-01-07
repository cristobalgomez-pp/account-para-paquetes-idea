import { useState } from "react";
import { Upload, X, FileImage, FileVideo, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
}

const PROBLEM_OPTIONS = [
  { value: "missing_product", label: "Producto faltante" },
  { value: "wrong_product", label: "Producto equivocado" },
  { value: "defective_product", label: "Producto defectuoso" },
  { value: "delivery_issues", label: "Problemas con la entrega" },
  { value: "return_request", label: "Solicitud de devolución" },
  { value: "payment_issues", label: "Problemas con mi pago" },
  { value: "other", label: "Otro" },
];

interface UploadedFile {
  id: string;
  name: string;
  type: "image" | "video";
  size: string;
}

export const SupportTicketDialog = ({
  open,
  onOpenChange,
  orderNumber,
}: SupportTicketDialogProps) => {
  const [problemType, setProblemType] = useState("");
  const [comments, setComments] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");

      if (!isImage && !isVideo) {
        toast.error(`${file.name} no es un archivo de imagen o video válido`);
        continue;
      }

      const sizeInMB = (file.size / (1024 * 1024)).toFixed(2);
      newFiles.push({
        id: `${Date.now()}-${i}`,
        name: file.name,
        type: isImage ? "image" : "video",
        size: `${sizeInMB} MB`,
      });
    }

    setUploadedFiles((prev) => [...prev, ...newFiles]);
    event.target.value = "";
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleSubmit = async () => {
    if (!problemType) {
      toast.error("Por favor selecciona el tipo de problema");
      return;
    }

    if (!comments.trim()) {
      toast.error("Por favor agrega un comentario describiendo tu problema");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const ticketNumber = `TKT-${Date.now().toString().slice(-6)}`;
    toast.success(`Ticket ${ticketNumber} creado exitosamente. Te contactaremos pronto.`);

    // Reset form
    setProblemType("");
    setComments("");
    setUploadedFiles([]);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setProblemType("");
      setComments("");
      setUploadedFiles([]);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Levantar ticket de soporte</DialogTitle>
          <DialogDescription>
            Completa la información para crear tu ticket de soporte
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Number - Read Only */}
          <div className="space-y-2">
            <Label>Número de orden</Label>
            <div className="p-3 bg-muted rounded-md font-medium text-foreground">
              {orderNumber}
            </div>
          </div>

          {/* Problem Type Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="problem-type">¿Qué problema quieres resolver?</Label>
            <Select value={problemType} onValueChange={setProblemType}>
              <SelectTrigger id="problem-type">
                <SelectValue placeholder="Selecciona una opción" />
              </SelectTrigger>
              <SelectContent>
                {PROBLEM_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Comentarios</Label>
            <Textarea
              id="comments"
              placeholder="Describe detalladamente tu problema, incluyendo cualquier información que consideres importante..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Evidence Upload */}
          <div className="space-y-3">
            <Label>Evidencias (fotos o videos)</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/*,video/*"
                multiple
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Haz clic para subir archivos o arrástralos aquí
                </span>
                <span className="text-xs text-muted-foreground/70">
                  Formatos: JPG, PNG, MP4, MOV
                </span>
              </label>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    {file.type === "image" ? (
                      <FileImage className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    ) : (
                      <FileVideo className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{file.size}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 flex-shrink-0"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
          >
            {isSubmitting ? (
              "Enviando..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Enviar ticket
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
