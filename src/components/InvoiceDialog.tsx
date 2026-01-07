import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Star, Check, Plus } from "lucide-react";
import { toast } from "sonner";

const CFDI_OPTIONS = [
  { value: "G01", label: "G01 - Adquisición de mercancías" },
  { value: "G02", label: "G02 - Devoluciones, descuentos o bonificaciones" },
  { value: "G03", label: "G03 - Gastos en general" },
  { value: "I01", label: "I01 - Construcciones" },
  { value: "I02", label: "I02 - Mobiliario y equipo de oficina" },
  { value: "I03", label: "I03 - Equipo de transporte" },
  { value: "I04", label: "I04 - Equipo de cómputo y accesorios" },
  { value: "D01", label: "D01 - Honorarios médicos, dentales y gastos hospitalarios" },
  { value: "P01", label: "P01 - Por definir" },
  { value: "S01", label: "S01 - Sin efectos fiscales" },
];

const REGIMEN_FISCAL_OPTIONS = [
  { value: "601", label: "601 - General de Ley Personas Morales" },
  { value: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
  { value: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { value: "606", label: "606 - Arrendamiento" },
  { value: "612", label: "612 - Personas Físicas con Actividades Empresariales y Profesionales" },
  { value: "616", label: "616 - Sin obligaciones fiscales" },
  { value: "626", label: "626 - Régimen Simplificado de Confianza" },
];

const ESTADOS_MEXICO = [
  { value: "AGU", label: "Aguascalientes" },
  { value: "BCN", label: "Baja California" },
  { value: "BCS", label: "Baja California Sur" },
  { value: "CAM", label: "Campeche" },
  { value: "CHP", label: "Chiapas" },
  { value: "CHH", label: "Chihuahua" },
  { value: "COA", label: "Coahuila" },
  { value: "COL", label: "Colima" },
  { value: "CMX", label: "Ciudad de México" },
  { value: "DUR", label: "Durango" },
  { value: "GUA", label: "Guanajuato" },
  { value: "GRO", label: "Guerrero" },
  { value: "HID", label: "Hidalgo" },
  { value: "JAL", label: "Jalisco" },
  { value: "MEX", label: "Estado de México" },
  { value: "MIC", label: "Michoacán" },
  { value: "MOR", label: "Morelos" },
  { value: "NAY", label: "Nayarit" },
  { value: "NLE", label: "Nuevo León" },
  { value: "OAX", label: "Oaxaca" },
  { value: "PUE", label: "Puebla" },
  { value: "QUE", label: "Querétaro" },
  { value: "ROO", label: "Quintana Roo" },
  { value: "SLP", label: "San Luis Potosí" },
  { value: "SIN", label: "Sinaloa" },
  { value: "SON", label: "Sonora" },
  { value: "TAB", label: "Tabasco" },
  { value: "TAM", label: "Tamaulipas" },
  { value: "TLA", label: "Tlaxcala" },
  { value: "VER", label: "Veracruz" },
  { value: "YUC", label: "Yucatán" },
  { value: "ZAC", label: "Zacatecas" },
];

export interface BillingAddress {
  id: string;
  rfc: string;
  razonSocial: string;
  usoCfdi: string;
  regimenFiscal: string;
  email: string;
  codigoPostal: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  colonia: string;
  municipio: string;
  estado: string;
  pais: string;
  isDefault: boolean;
}

interface BillingFormData {
  rfc: string;
  razonSocial: string;
  usoCfdi: string;
  regimenFiscal: string;
  email: string;
  codigoPostal: string;
  calle: string;
  numeroExterior: string;
  numeroInterior: string;
  colonia: string;
  municipio: string;
  estado: string;
  pais: string;
}

const emptyFormData: BillingFormData = {
  rfc: "",
  razonSocial: "",
  usoCfdi: "",
  regimenFiscal: "",
  email: "",
  codigoPostal: "",
  calle: "",
  numeroExterior: "",
  numeroInterior: "",
  colonia: "",
  municipio: "",
  estado: "",
  pais: "México",
};

interface InvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderNumber: string;
  billingAddresses: BillingAddress[];
  onAddAddress: (address: BillingAddress) => void;
  onInvoice: (addressId: string) => void;
}

export const InvoiceDialog = ({
  open,
  onOpenChange,
  orderNumber,
  billingAddresses,
  onAddAddress,
  onInvoice,
}: InvoiceDialogProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    billingAddresses.find((a) => a.isDefault)?.id || null
  );
  const [showForm, setShowForm] = useState(billingAddresses.length === 0);
  const [formData, setFormData] = useState<BillingFormData>(emptyFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof BillingFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BillingFormData, string>> = {};

    if (!formData.rfc.trim()) {
      newErrors.rfc = "El RFC es obligatorio";
    } else if (!/^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/i.test(formData.rfc.trim())) {
      newErrors.rfc = "El RFC no tiene un formato válido";
    }

    if (!formData.razonSocial.trim()) {
      newErrors.razonSocial = "La Razón Social es obligatoria";
    }

    if (!formData.usoCfdi) {
      newErrors.usoCfdi = "El Uso de CFDI es obligatorio";
    }

    if (!formData.regimenFiscal) {
      newErrors.regimenFiscal = "El Régimen Fiscal es obligatorio";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "El correo electrónico no es válido";
    }

    if (!formData.codigoPostal.trim()) {
      newErrors.codigoPostal = "El código postal es obligatorio";
    } else if (!/^\d{5}$/.test(formData.codigoPostal.trim())) {
      newErrors.codigoPostal = "El código postal debe tener 5 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof BillingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      const newAddress: BillingAddress = {
        id: Date.now().toString(),
        ...formData,
        isDefault: billingAddresses.length === 0,
      };
      onAddAddress(newAddress);
      onInvoice(newAddress.id);
      onOpenChange(false);
      toast.success(`Orden ${orderNumber} facturada exitosamente`);
      setFormData(emptyFormData);
      setShowForm(false);
    }
  };

  const handleSelectAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
  };

  const handleConfirmInvoice = () => {
    if (selectedAddressId) {
      onInvoice(selectedAddressId);
      onOpenChange(false);
      toast.success(`Orden ${orderNumber} facturada exitosamente`);
    }
  };

  const getEstadoLabel = (value: string) =>
    ESTADOS_MEXICO.find((o) => o.value === value)?.label || value;

  // If no addresses, show form directly
  if (showForm || billingAddresses.length === 0) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Datos de Facturación</DialogTitle>
            <DialogDescription>
              {billingAddresses.length === 0
                ? "Ingresa tus datos fiscales para facturar esta orden. Esta dirección se guardará en tu cuenta."
                : "Agrega una nueva dirección de facturación"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitForm} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rfc">
                  RFC <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rfc"
                  value={formData.rfc}
                  onChange={(e) => handleInputChange("rfc", e.target.value.toUpperCase())}
                  placeholder="XAXX010101000"
                  className={errors.rfc ? "border-destructive" : ""}
                />
                {errors.rfc && <p className="text-sm text-destructive">{errors.rfc}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="razonSocial">
                  Razón Social <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="razonSocial"
                  value={formData.razonSocial}
                  onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                  placeholder="Nombre o Razón Social"
                  className={errors.razonSocial ? "border-destructive" : ""}
                />
                {errors.razonSocial && (
                  <p className="text-sm text-destructive">{errors.razonSocial}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="usoCfdi">
                  Uso de CFDI <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.usoCfdi}
                  onValueChange={(value) => handleInputChange("usoCfdi", value)}
                >
                  <SelectTrigger className={errors.usoCfdi ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar uso de CFDI" />
                  </SelectTrigger>
                  <SelectContent>
                    {CFDI_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.usoCfdi && <p className="text-sm text-destructive">{errors.usoCfdi}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="regimenFiscal">
                  Régimen Fiscal <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.regimenFiscal}
                  onValueChange={(value) => handleInputChange("regimenFiscal", value)}
                >
                  <SelectTrigger className={errors.regimenFiscal ? "border-destructive" : ""}>
                    <SelectValue placeholder="Seleccionar régimen fiscal" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIMEN_FISCAL_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.regimenFiscal && (
                  <p className="text-sm text-destructive">{errors.regimenFiscal}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">
                  Correo Electrónico <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="facturacion@empresa.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoPostal">
                  Código Postal <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="codigoPostal"
                  value={formData.codigoPostal}
                  onChange={(e) => handleInputChange("codigoPostal", e.target.value)}
                  placeholder="06600"
                  maxLength={5}
                  className={errors.codigoPostal ? "border-destructive" : ""}
                />
                {errors.codigoPostal && (
                  <p className="text-sm text-destructive">{errors.codigoPostal}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="calle">Calle</Label>
                <Input
                  id="calle"
                  value={formData.calle}
                  onChange={(e) => handleInputChange("calle", e.target.value)}
                  placeholder="Av. Reforma"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroExterior">Número Exterior</Label>
                <Input
                  id="numeroExterior"
                  value={formData.numeroExterior}
                  onChange={(e) => handleInputChange("numeroExterior", e.target.value)}
                  placeholder="123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numeroInterior">Número Interior</Label>
                <Input
                  id="numeroInterior"
                  value={formData.numeroInterior}
                  onChange={(e) => handleInputChange("numeroInterior", e.target.value)}
                  placeholder="Piso 4"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="colonia">Colonia</Label>
                <Input
                  id="colonia"
                  value={formData.colonia}
                  onChange={(e) => handleInputChange("colonia", e.target.value)}
                  placeholder="Juárez"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="municipio">Municipio / Alcaldía</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => handleInputChange("municipio", e.target.value)}
                  placeholder="Cuauhtémoc"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => handleInputChange("estado", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {ESTADOS_MEXICO.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pais">País</Label>
                <Input id="pais" value={formData.pais} disabled />
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              {billingAddresses.length > 0 && (
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              )}
              <Button type="submit">Facturar orden</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Show address selection
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Seleccionar dirección de facturación</DialogTitle>
          <DialogDescription>
            Elige la dirección de facturación para la orden {orderNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {billingAddresses.map((address) => (
            <Card
              key={address.id}
              className={`cursor-pointer transition-all ${
                selectedAddressId === address.id
                  ? "border-primary border-2 bg-primary/5"
                  : "hover:border-muted-foreground/50"
              }`}
              onClick={() => handleSelectAddress(address.id)}
            >
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      selectedAddressId === address.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground/50"
                    }`}
                  >
                    {selectedAddressId === address.id && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold truncate">{address.razonSocial}</span>
                      {address.isDefault && (
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <Star className="w-3 h-3" />
                          Predeterminada
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-0.5">
                      <p>RFC: {address.rfc}</p>
                      <p>
                        {[
                          address.calle,
                          address.numeroExterior,
                          address.colonia,
                          address.codigoPostal,
                          getEstadoLabel(address.estado),
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outline"
            className="w-full gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="w-4 h-4" />
            Agregar nueva dirección
          </Button>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmInvoice} disabled={!selectedAddressId}>
            Facturar orden
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
