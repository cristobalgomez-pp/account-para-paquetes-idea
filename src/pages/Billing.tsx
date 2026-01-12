import { FileText, Save, Plus, Trash2, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import AccountNav from "@/components/AccountNav";

const CFDI_OPTIONS = [
  { value: "G01", label: "G01 - Adquisición de mercancías" },
  { value: "G02", label: "G02 - Devoluciones, descuentos o bonificaciones" },
  { value: "G03", label: "G03 - Gastos en general" },
  { value: "I01", label: "I01 - Construcciones" },
  { value: "I02", label: "I02 - Mobiliario y equipo de oficina" },
  { value: "I03", label: "I03 - Equipo de transporte" },
  { value: "I04", label: "I04 - Equipo de cómputo y accesorios" },
  { value: "I05", label: "I05 - Dados, troqueles, moldes, matrices" },
  { value: "I06", label: "I06 - Comunicaciones telefónicas" },
  { value: "I07", label: "I07 - Comunicaciones satelitales" },
  { value: "I08", label: "I08 - Otra maquinaria y equipo" },
  { value: "D01", label: "D01 - Honorarios médicos, dentales y gastos hospitalarios" },
  { value: "D02", label: "D02 - Gastos médicos por incapacidad o discapacidad" },
  { value: "D03", label: "D03 - Gastos funerales" },
  { value: "D04", label: "D04 - Donativos" },
  { value: "D05", label: "D05 - Intereses reales efectivamente pagados por créditos hipotecarios" },
  { value: "D06", label: "D06 - Aportaciones voluntarias al SAR" },
  { value: "D07", label: "D07 - Primas por seguros de gastos médicos" },
  { value: "D08", label: "D08 - Gastos de transportación escolar obligatoria" },
  { value: "D09", label: "D09 - Depósitos en cuentas para el ahorro" },
  { value: "D10", label: "D10 - Pagos por servicios educativos (colegiaturas)" },
  { value: "P01", label: "P01 - Por definir" },
  { value: "S01", label: "S01 - Sin efectos fiscales" },
  { value: "CP01", label: "CP01 - Pagos" },
  { value: "CN01", label: "CN01 - Nómina" },
];

const REGIMEN_FISCAL_OPTIONS = [
  { value: "601", label: "601 - General de Ley Personas Morales" },
  { value: "603", label: "603 - Personas Morales con Fines no Lucrativos" },
  { value: "605", label: "605 - Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { value: "606", label: "606 - Arrendamiento" },
  { value: "607", label: "607 - Régimen de Enajenación o Adquisición de Bienes" },
  { value: "608", label: "608 - Demás ingresos" },
  { value: "610", label: "610 - Residentes en el Extranjero sin Establecimiento Permanente en México" },
  { value: "611", label: "611 - Ingresos por Dividendos (socios y accionistas)" },
  { value: "612", label: "612 - Personas Físicas con Actividades Empresariales y Profesionales" },
  { value: "614", label: "614 - Ingresos por intereses" },
  { value: "615", label: "615 - Régimen de los ingresos por obtención de premios" },
  { value: "616", label: "616 - Sin obligaciones fiscales" },
  { value: "620", label: "620 - Sociedades Cooperativas de Producción que optan por diferir sus ingresos" },
  { value: "621", label: "621 - Incorporación Fiscal" },
  { value: "622", label: "622 - Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras" },
  { value: "623", label: "623 - Opcional para Grupos de Sociedades" },
  { value: "624", label: "624 - Coordinados" },
  { value: "625", label: "625 - Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas" },
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

interface BillingAddress {
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

// Demo billing addresses
const initialBillingAddresses: BillingAddress[] = [
  {
    id: "1",
    rfc: "ABC123456789",
    razonSocial: "Empresa Demo S.A. de C.V.",
    usoCfdi: "G03",
    regimenFiscal: "601",
    email: "facturacion@empresademo.com",
    codigoPostal: "06600",
    calle: "Av. Reforma",
    numeroExterior: "222",
    numeroInterior: "Piso 10",
    colonia: "Juárez",
    municipio: "Cuauhtémoc",
    estado: "CMX",
    pais: "México",
    isDefault: true,
  },
];

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

const Billing = () => {
  const [billingAddresses, setBillingAddresses] = useState<BillingAddress[]>(initialBillingAddresses);
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<BillingFormData>(emptyFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof BillingFormData, string>>>({});

  const defaultAddress = billingAddresses.find(a => a.isDefault);

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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (editingId) {
        // Update existing address
        setBillingAddresses(prev => prev.map(addr => 
          addr.id === editingId 
            ? { ...addr, ...formData }
            : addr
        ));
        toast({
          title: "Dirección actualizada",
          description: "Los datos de facturación se han actualizado correctamente.",
        });
      } else {
        // Create new address
        const newAddress: BillingAddress = {
          id: Date.now().toString(),
          ...formData,
          isDefault: billingAddresses.length === 0, // First address is default
        };
        setBillingAddresses(prev => [...prev, newAddress]);
        toast({
          title: "Dirección agregada",
          description: "La nueva dirección de facturación se ha guardado correctamente.",
        });
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyFormData);
      setErrors({});
    } else {
      toast({
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos obligatorios correctamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (address: BillingAddress) => {
    setFormData({
      rfc: address.rfc,
      razonSocial: address.razonSocial,
      usoCfdi: address.usoCfdi,
      regimenFiscal: address.regimenFiscal,
      email: address.email,
      codigoPostal: address.codigoPostal,
      calle: address.calle,
      numeroExterior: address.numeroExterior,
      numeroInterior: address.numeroInterior,
      colonia: address.colonia,
      municipio: address.municipio,
      estado: address.estado,
      pais: address.pais,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const addressToDelete = billingAddresses.find(a => a.id === id);
    setBillingAddresses(prev => {
      const remaining = prev.filter(a => a.id !== id);
      // If we deleted the default, make the first remaining one default
      if (addressToDelete?.isDefault && remaining.length > 0) {
        remaining[0].isDefault = true;
      }
      return remaining;
    });
    toast({
      title: "Dirección eliminada",
      description: "La dirección de facturación se ha eliminado correctamente.",
    });
  };

  const handleSetDefault = (id: string) => {
    setBillingAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    })));
    toast({
      title: "Dirección predeterminada",
      description: "La dirección de facturación predeterminada se ha actualizado.",
    });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyFormData);
    setErrors({});
  };

  const handleAutoInvoicingChange = (checked: boolean) => {
    if (checked && !defaultAddress) {
      toast({
        title: "No hay dirección predeterminada",
        description: "Agrega al menos una dirección de facturación para activar la facturación automática.",
        variant: "destructive",
      });
      return;
    }
    setAutoInvoicing(checked);
    toast({
      title: checked ? "Facturación automática activada" : "Facturación automática desactivada",
      description: checked 
        ? "Todas tus órdenes se facturarán automáticamente a tu dirección predeterminada."
        : "Deberás solicitar la factura manualmente para cada orden.",
    });
  };

  const getCfdiLabel = (value: string) => CFDI_OPTIONS.find(o => o.value === value)?.label || value;
  const getRegimenLabel = (value: string) => REGIMEN_FISCAL_OPTIONS.find(o => o.value === value)?.label || value;
  const getEstadoLabel = (value: string) => ESTADOS_MEXICO.find(o => o.value === value)?.label || value;

  return (
    <div className="min-h-screen bg-background">
      <AccountNav />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-billing flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
            <p className="text-muted-foreground">Administra tus datos fiscales para facturar órdenes</p>
          </div>
        </div>

        {/* Auto Invoicing Toggle */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">Facturación Automática</h3>
                  {autoInvoicing && defaultAddress && (
                    <Badge className="bg-green-500 hover:bg-green-600">Activa</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {autoInvoicing && defaultAddress
                    ? `Todas tus órdenes se facturarán a: ${defaultAddress.razonSocial}`
                    : "Activa esta opción para facturar automáticamente todas tus órdenes a tu dirección predeterminada."
                  }
                </p>
              </div>
              <Switch
                checked={autoInvoicing && !!defaultAddress}
                onCheckedChange={handleAutoInvoicingChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Addresses List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Direcciones de Facturación</h2>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Agregar dirección
            </Button>
          )}
        </div>

        {billingAddresses.length === 0 && !showForm && (
          <Card className="mb-6">
            <CardContent className="py-12 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No tienes direcciones de facturación registradas</p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Agregar primera dirección
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Existing Addresses */}
        <div className="space-y-4 mb-6">
          {billingAddresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-primary border-2" : ""}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">{address.razonSocial}</h3>
                      {address.isDefault && (
                        <Badge variant="secondary" className="gap-1">
                          <Star className="w-3 h-3" />
                          Predeterminada
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
                      <div>
                        <span className="font-medium text-foreground">RFC:</span> {address.rfc}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Email:</span> {address.email}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Uso CFDI:</span> {address.usoCfdi}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">Régimen:</span> {address.regimenFiscal}
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-foreground">Dirección:</span>{" "}
                        {[address.calle, address.numeroExterior, address.colonia, address.codigoPostal, getEstadoLabel(address.estado)]
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!address.isDefault && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleSetDefault(address.id)}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Predeterminada
                      </Button>
                    )}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(address)}
                    >
                      Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar dirección de facturación?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la dirección de facturación "{address.razonSocial}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(address.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? "Editar Dirección de Facturación" : "Nueva Dirección de Facturación"}</CardTitle>
              <CardDescription>
                Completa los campos obligatorios (*) para {editingId ? "actualizar" : "agregar"} la dirección de facturación.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Datos Fiscales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Datos Fiscales</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rfc">RFC *</Label>
                      <Input
                        id="rfc"
                        placeholder="XAXX010101000"
                        value={formData.rfc}
                        onChange={(e) => handleInputChange("rfc", e.target.value.toUpperCase())}
                        className={errors.rfc ? "border-destructive" : ""}
                        maxLength={13}
                      />
                      {errors.rfc && <p className="text-sm text-destructive">{errors.rfc}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="razonSocial">Razón Social *</Label>
                      <Input
                        id="razonSocial"
                        placeholder="Nombre o Razón Social"
                        value={formData.razonSocial}
                        onChange={(e) => handleInputChange("razonSocial", e.target.value)}
                        className={errors.razonSocial ? "border-destructive" : ""}
                      />
                      {errors.razonSocial && <p className="text-sm text-destructive">{errors.razonSocial}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="usoCfdi">Uso de CFDI *</Label>
                      <Select value={formData.usoCfdi} onValueChange={(value) => handleInputChange("usoCfdi", value)}>
                        <SelectTrigger className={errors.usoCfdi ? "border-destructive" : ""}>
                          <SelectValue placeholder="Seleccionar uso de CFDI" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
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
                      <Label htmlFor="regimenFiscal">Régimen Fiscal *</Label>
                      <Select value={formData.regimenFiscal} onValueChange={(value) => handleInputChange("regimenFiscal", value)}>
                        <SelectTrigger className={errors.regimenFiscal ? "border-destructive" : ""}>
                          <SelectValue placeholder="Seleccionar régimen fiscal" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {REGIMEN_FISCAL_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.regimenFiscal && <p className="text-sm text-destructive">{errors.regimenFiscal}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo Electrónico *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="facturacion@ejemplo.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                {/* Dirección Fiscal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground">Dirección Fiscal</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="codigoPostal">Código Postal *</Label>
                      <Input
                        id="codigoPostal"
                        placeholder="00000"
                        value={formData.codigoPostal}
                        onChange={(e) => handleInputChange("codigoPostal", e.target.value.replace(/\D/g, ""))}
                        className={errors.codigoPostal ? "border-destructive" : ""}
                        maxLength={5}
                      />
                      {errors.codigoPostal && <p className="text-sm text-destructive">{errors.codigoPostal}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="calle">Calle</Label>
                      <Input
                        id="calle"
                        placeholder="Nombre de la calle"
                        value={formData.calle}
                        onChange={(e) => handleInputChange("calle", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="numeroExterior">Número Exterior</Label>
                      <Input
                        id="numeroExterior"
                        placeholder="123"
                        value={formData.numeroExterior}
                        onChange={(e) => handleInputChange("numeroExterior", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numeroInterior">Número Interior</Label>
                      <Input
                        id="numeroInterior"
                        placeholder="A"
                        value={formData.numeroInterior}
                        onChange={(e) => handleInputChange("numeroInterior", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="colonia">Colonia</Label>
                      <Input
                        id="colonia"
                        placeholder="Nombre de la colonia"
                        value={formData.colonia}
                        onChange={(e) => handleInputChange("colonia", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="municipio">Municipio</Label>
                      <Input
                        id="municipio"
                        placeholder="Nombre del municipio"
                        value={formData.municipio}
                        onChange={(e) => handleInputChange("municipio", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="estado">Estado</Label>
                      <Select value={formData.estado} onValueChange={(value) => handleInputChange("estado", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          {ESTADOS_MEXICO.map((estado) => (
                            <SelectItem key={estado.value} value={estado.value}>
                              {estado.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pais">País</Label>
                      <Input
                        id="pais"
                        value={formData.pais}
                        onChange={(e) => handleInputChange("pais", e.target.value)}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={handleCancelForm}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="gap-2">
                    <Save className="w-4 h-4" />
                    {editingId ? "Guardar cambios" : "Agregar dirección"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Billing;
