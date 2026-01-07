import { useState } from "react";
import { Upload, X, FileImage, FileVideo, Send, CheckCircle2, Clock, MessageSquare, AlertCircle, Headphones } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export interface TicketEvent {
  id: string;
  date: string;
  time: string;
  status: "created" | "in_review" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  title: string;
  description: string;
  agent?: string;
}

export interface SupportTicket {
  ticketNumber: string;
  problemType: string;
  status: "open" | "in_progress" | "waiting_customer" | "resolved" | "closed";
  createdAt: string;
  events: TicketEvent[];
}

interface SupportTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  existingTicket?: SupportTicket;
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

const TICKET_STATUS_CONFIG = {
  open: { label: "Abierto", variant: "info" as const, icon: AlertCircle },
  in_progress: { label: "En proceso", variant: "pending" as const, icon: Clock },
  waiting_customer: { label: "Esperando respuesta", variant: "warning" as const, icon: MessageSquare },
  resolved: { label: "Resuelto", variant: "success" as const, icon: CheckCircle2 },
  closed: { label: "Cerrado", variant: "secondary" as const, icon: CheckCircle2 },
};

const TICKET_CHECKPOINTS = [
  { key: "created", label: "Creado" },
  { key: "in_review", label: "En revisión" },
  { key: "in_progress", label: "En proceso" },
  { key: "resolved", label: "Resuelto" },
  { key: "closed", label: "Cerrado" },
];

interface UploadedFile {
  id: string;
  name: string;
  type: "image" | "video";
  size: string;
}

const getCheckpointIndex = (status: SupportTicket["status"]) => {
  const mapping: Record<string, number> = {
    open: 0,
    in_progress: 2,
    waiting_customer: 2,
    resolved: 3,
    closed: 4,
  };
  return mapping[status] ?? 0;
};

export const SupportTicketDialog = ({
  open,
  onOpenChange,
  orderNumber,
  existingTicket,
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

  // If there's an existing ticket, show the history view
  if (existingTicket) {
    const currentCheckpoint = getCheckpointIndex(existingTicket.status);
    const StatusIcon = TICKET_STATUS_CONFIG[existingTicket.status].icon;

    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Headphones className="w-5 h-5 text-primary" />
              </div>
              <div>
                <DialogTitle>Ticket {existingTicket.ticketNumber}</DialogTitle>
                <DialogDescription>
                  Orden {orderNumber} • {PROBLEM_OPTIONS.find(p => p.value === existingTicket.problemType)?.label}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Estado actual:</span>
              <Badge variant={TICKET_STATUS_CONFIG[existingTicket.status].variant} className="gap-1">
                <StatusIcon className="w-3 h-3" />
                {TICKET_STATUS_CONFIG[existingTicket.status].label}
              </Badge>
            </div>

            {/* Progress Checkpoints */}
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center relative">
                {/* Progress Line */}
                <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-muted-foreground/20 rounded-full" />
                <div 
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(currentCheckpoint / (TICKET_CHECKPOINTS.length - 1)) * 100}%` }}
                />
                
                {TICKET_CHECKPOINTS.map((checkpoint, index) => {
                  const isCompleted = index <= currentCheckpoint;
                  const isCurrent = index === currentCheckpoint;
                  
                  return (
                    <div key={checkpoint.key} className="relative flex flex-col items-center z-10">
                      <div
                        className={`w-4 h-4 rounded-full border-2 transition-all ${
                          isCompleted
                            ? "bg-primary border-primary"
                            : "bg-background border-muted-foreground/30"
                        } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                      >
                        {isCompleted && (
                          <CheckCircle2 className="w-full h-full text-primary-foreground p-0.5" />
                        )}
                      </div>
                      <span
                        className={`text-[10px] mt-2 text-center max-w-[60px] ${
                          isCompleted ? "text-foreground font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {checkpoint.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            {/* Ticket History */}
            <div>
              <h4 className="font-semibold mb-4">Historial del ticket</h4>
              <div className="space-y-0">
                {existingTicket.events.map((event, index) => {
                  const isLast = index === existingTicket.events.length - 1;
                  
                  return (
                    <div key={event.id} className="flex gap-4">
                      {/* Timeline */}
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                        {!isLast && (
                          <div className="w-0.5 flex-1 bg-border min-h-[60px]" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{event.title}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">
                          {event.description}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{event.date}</span>
                          <span>•</span>
                          <span>{event.time}</span>
                          {event.agent && (
                            <>
                              <span>•</span>
                              <span>Agente: {event.agent}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Actions for existing ticket */}
            {existingTicket.status !== "closed" && existingTicket.status !== "resolved" && (
              <>
                <Separator />
                <div className="space-y-3">
                  <Label htmlFor="reply">Agregar comentario</Label>
                  <Textarea
                    id="reply"
                    placeholder="Escribe un mensaje para el equipo de soporte..."
                    rows={3}
                    className="resize-none"
                  />
                  <Button className="w-full">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar mensaje
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Create new ticket form
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
