import { FileText, ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

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

const Billing = () => {
  const [formData, setFormData] = useState<BillingFormData>({
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
  });

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
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast({
        title: "Datos guardados",
        description: "Los datos de facturación se han guardado correctamente.",
      });
    } else {
      toast({
        title: "Error en el formulario",
        description: "Por favor, complete todos los campos obligatorios correctamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-billing flex items-center justify-center">
            <FileText className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
            <p className="text-muted-foreground">Datos fiscales para facturar tus órdenes</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Datos de Facturación</CardTitle>
            <CardDescription>
              Completa los campos obligatorios (*) para poder facturar tus órdenes.
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

              <div className="flex justify-end pt-4">
                <Button type="submit" className="gap-2">
                  <Save className="w-4 h-4" />
                  Guardar datos de facturación
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
