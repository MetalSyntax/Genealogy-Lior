import React, { useState } from 'react';
import { ChevronRight, ChevronDown, User } from 'lucide-react';
import { Person } from '../utils/parseCsv';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TreeNodeProps {
  person: Person;
  level?: number;
  onSelect: (person: Person) => void;
  selectedId?: string;
  defaultExpanded?: boolean;
}

export const TreeNode: React.FC<TreeNodeProps> = ({ 
  person, 
  level = 0, 
  onSelect, 
  selectedId,
  defaultExpanded = false
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasChildren = person.children && person.children.length > 0;
  const isSelected = selectedId === person.DocumentoDeIdentidad;

  return (
    <div className="w-full">
      <div 
        className={cn(
          "flex items-center py-2 px-3 my-1 rounded-xl cursor-pointer transition-all duration-200",
          "hover:bg-slate-100",
          isSelected ? "bg-indigo-50 border border-indigo-100 shadow-sm" : "border border-transparent"
        )}
        style={{ paddingLeft: `${level * 1.5 + 0.75}rem` }}
        onClick={() => onSelect(person)}
      >
        <div 
          className="w-6 h-6 flex items-center justify-center mr-2 text-slate-400 hover:text-slate-600"
          onClick={(e) => {
            if (hasChildren) {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }
          }}
        >
          {hasChildren ? (
            isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />
          ) : (
            <div className="w-4 h-4" />
          )}
        </div>
        
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0",
          isSelected ? "bg-indigo-500 text-white" : "bg-slate-200 text-slate-600"
        )}>
          <User size={16} />
        </div>
        
        <div className="flex flex-col overflow-hidden">
          <span className="text-sm font-medium text-slate-900 truncate">
            {person.Nombre || 'Sin Nombre'}
          </span>
          <span className="text-xs text-slate-500 truncate flex items-center gap-2">
            <span>ID: {person.DocumentoDeIdentidad}</span>
            {person.Posicion && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-indigo-600 font-medium">{person.Posicion}</span>
              </>
            )}
          </span>
        </div>
        
        {hasChildren && (
          <div className="ml-auto bg-slate-100 text-slate-500 text-xs font-medium px-2 py-0.5 rounded-full">
            {person.children!.length}
          </div>
        )}
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {person.children!.map((child) => (
              <TreeNode 
                key={child.DocumentoDeIdentidad} 
                person={child} 
                level={level + 1} 
                onSelect={onSelect}
                selectedId={selectedId}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
