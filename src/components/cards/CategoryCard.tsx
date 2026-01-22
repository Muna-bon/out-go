import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  color: string;
  onClick?: () => void;
}

const CategoryCard = ({ name, icon: Icon, count, color, onClick }: CategoryCardProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="card-elevated p-6 text-left w-full group"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="h-7 w-7" style={{ color }} />
      </div>
      <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
        {name}
      </h3>
      <p className="text-sm text-muted-foreground">
        {count} activities
      </p>
    </motion.button>
  );
};

export default CategoryCard;
