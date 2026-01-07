import { RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Subscriptions = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-6 -ml-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-xl bg-subscriptions flex items-center justify-center">
            <RefreshCw className="w-7 h-7 text-white" strokeWidth={1.8} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Suscripciones</h1>
            <p className="text-muted-foreground">Planes y renovaciones activas</p>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-8 text-center">
          <RefreshCw className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No tienes suscripciones activas</p>
        </div>
      </div>
    </div>
  );
};

export default Subscriptions;
