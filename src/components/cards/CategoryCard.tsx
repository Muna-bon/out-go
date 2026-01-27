import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  name: string;
  icon: LucideIcon;
  count: number;
  color: string;
  onClick?: () => void;
}

const getSlug = (name: string): string => {
  return name.toLowerCase().replace(/\s*&\s*/g, "-").replace(/\s+/g, "-");
};

const CategoryCard = ({ name, icon: Icon, count, color, onClick }: CategoryCardProps) => {
  const slug = getSlug(name);
  
  return (
    <Link to={`/category/${slug}`}>
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
    </Link>
  );
};

export default CategoryCard;
