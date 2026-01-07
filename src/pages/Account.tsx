import { useState } from "react";
import { User, ArrowLeft, Mail, Lock, Bell, Globe, Shield, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

const Account = () => {
  const [profile, setProfile] = useState({
    firstName: "Juan",
    lastName: "Pérez",
    email: "juan.perez@email.com",
    phone: "+52 55 1234 5678",
    avatar: "",
  });

  const [preferences, setPreferences] = useState({
    language: "es",
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    orderUpdates: true,
    twoFactorAuth: false,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileSave = () => {
    toast.success("Información personal actualizada");
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    if (passwords.new.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return;
    }
    toast.success("Contraseña actualizada correctamente");
    setPasswords({ current: "", new: "", confirm: "" });
  };

  const handlePreferencesSave = () => {
    toast.success("Preferencias guardadas");
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
          <div className="w-14 h-14 rounded-xl bg-account flex items-center justify-center">
            <User className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mi Cuenta</h1>
            <p className="text-muted-foreground">Información personal y preferencias</p>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Actualiza tu información de perfil y datos de contacto
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profile.avatar} />
                    <AvatarFallback className="text-xl bg-primary/10 text-primary">
                      {profile.firstName[0]}{profile.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Cambiar foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      JPG, PNG o GIF. Máximo 2MB.
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Name Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                </div>

                {/* Contact Fields */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        className="pl-10"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleProfileSave}>Guardar cambios</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Cambiar Contraseña
                </CardTitle>
                <CardDescription>
                  Actualiza tu contraseña para mantener tu cuenta segura
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Contraseña actual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwords.new}
                      onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  La contraseña debe tener al menos 8 caracteres
                </p>
                <div className="flex justify-end">
                  <Button onClick={handlePasswordChange}>Actualizar contraseña</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Autenticación de Dos Factores
                </CardTitle>
                <CardDescription>
                  Añade una capa extra de seguridad a tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Habilitar 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe un código por SMS al iniciar sesión
                    </p>
                  </div>
                  <Switch
                    checked={preferences.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, twoFactorAuth: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Idioma y Región
                </CardTitle>
                <CardDescription>
                  Configura tu idioma preferido
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value) => setPreferences({ ...preferences, language: value })}
                  >
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="es">Español (México)</SelectItem>
                      <SelectItem value="en">English (US)</SelectItem>
                      <SelectItem value="pt">Português (Brasil)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notificaciones
                </CardTitle>
                <CardDescription>
                  Gestiona cómo quieres recibir actualizaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Notificaciones por correo</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones importantes por email
                    </p>
                  </div>
                  <Switch
                    checked={preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Notificaciones por SMS</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe actualizaciones por mensaje de texto
                    </p>
                  </div>
                  <Switch
                    checked={preferences.smsNotifications}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, smsNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Actualizaciones de pedidos</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe notificaciones sobre el estado de tus pedidos
                    </p>
                  </div>
                  <Switch
                    checked={preferences.orderUpdates}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, orderUpdates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium">Correos promocionales</p>
                    <p className="text-sm text-muted-foreground">
                      Recibe ofertas especiales y descuentos
                    </p>
                  </div>
                  <Switch
                    checked={preferences.promotionalEmails}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, promotionalEmails: checked })
                    }
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={handlePreferencesSave}>Guardar preferencias</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;
