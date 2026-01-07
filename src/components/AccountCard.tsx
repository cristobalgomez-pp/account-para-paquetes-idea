import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AccountCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgClass: string;
  path: string;
}

const AccountCard = ({ title, description, icon: Icon, iconBgClass, path }: AccountCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(path)}
      className={cn(
        "group cursor-pointer rounded-xl border border-border bg-card p-6",
        "transition-all duration-300 ease-out",
        "hover:shadow-card-hover hover:border-primary/20 hover:-translate-y-1"
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
        "transition-transform duration-300 group-hover:scale-110",
        iconBgClass
      )}>
        <Icon className="w-7 h-7 text-white" strokeWidth={1.8} />
      </div>
      
      <h3 className="text-lg font-semibold text-foreground mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default AccountCard;
