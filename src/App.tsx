import React, { useState, useMemo, useCallback } from 'react';
import { Upload, FileText, Search, Users, GitMerge, LayoutDashboard, Menu, X } from 'lucide-react';
import { parseCsv, buildTree, Person } from './utils/parseCsv';
import { TreeNode } from './components/TreeNode';
import { DetailsPanel } from './components/DetailsPanel';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [data, setData] = useState<Person[]>([]);
  const [treeData, setTreeData] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [relationType, setRelationType] = useState<'LiderEstructuraDocumento' | 'RecomendanteDocumento'>('LiderEstructuraDocumento');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        processData(text);
      };
      reader.readAsText(file);
    }
  };

  const processData = useCallback((csvText: string) => {
    try {
      const parsedData = parseCsv(csvText);
      setData(parsedData);
      const tree = buildTree(parsedData, relationType);
      setTreeData(tree);
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Hubo un error al procesar el archivo CSV. Asegúrate de que el formato sea correcto.");
    }
  }, [relationType]);

  // Rebuild tree when relation type changes
  React.useEffect(() => {
    if (data.length > 0) {
      const tree = buildTree(data, relationType);
      setTreeData(tree);
    }
  }, [relationType, data]);

  const filteredTree = useMemo(() => {
    if (!searchTerm) return treeData;

    const lowerSearch = searchTerm.toLowerCase();
    
    // Helper to filter tree recursively
    const filterNodes = (nodes: Person[]): Person[] => {
      return nodes.reduce((acc: Person[], node) => {
        const matches = 
          node.Nombre.toLowerCase().includes(lowerSearch) || 
          node.DocumentoDeIdentidad.toLowerCase().includes(lowerSearch);
        
        const filteredChildren = node.children ? filterNodes(node.children) : [];
        
        if (matches || filteredChildren.length > 0) {
          acc.push({ ...node, children: filteredChildren });
        }
        
        return acc;
      }, []);
    };

    return filterNodes(treeData);
  }, [treeData, searchTerm]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            onClick={toggleMobileMenu}
          >
            <Menu size={20} />
          </button>
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-sm shadow-indigo-200">
            <Users size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 hidden sm:block">Genealogía</h1>
        </div>

        <div className="flex items-center gap-3">
          {data.length > 0 && (
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setRelationType('LiderEstructuraDocumento')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  relationType === 'LiderEstructuraDocumento' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Por Líder
              </button>
              <button
                onClick={() => setRelationType('RecomendanteDocumento')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  relationType === 'RecomendanteDocumento' 
                    ? 'bg-white text-indigo-700 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Por Recomendante
              </button>
            </div>
          )}
          
          <label className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl cursor-pointer transition-colors shadow-sm shadow-indigo-200">
            <Upload size={16} />
            <span className="hidden sm:inline">Cargar CSV</span>
            <input 
              type="file" 
              accept=".csv,.txt" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">
        {data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
              <FileText size={48} className="text-indigo-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Sube tu archivo de genealogía</h2>
            <p className="text-slate-500 max-w-md mb-8">
              Carga el archivo CSV con la base de datos para visualizar y explorar la estructura jerárquica de tu organización.
            </p>
            <label className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl cursor-pointer transition-all shadow-sm shadow-indigo-200 hover:shadow-md hover:-translate-y-0.5">
              <Upload size={20} />
              <span>Seleccionar Archivo CSV</span>
              <input 
                type="file" 
                accept=".csv,.txt" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>
        ) : (
          <div className="flex-1 flex w-full h-full">
            {/* Sidebar / Tree View */}
            <div className={`
              ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
              md:translate-x-0 
              absolute md:relative z-20 
              w-80 md:w-96 h-full 
              bg-white border-r border-slate-200 
              flex flex-col transition-transform duration-300 ease-in-out
              shadow-2xl md:shadow-none
            `}>
              <div className="p-4 border-b border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between md:hidden">
                  <h2 className="font-semibold text-slate-900">Estructura</h2>
                  <button onClick={toggleMobileMenu} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre o ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </div>
                
                {/* Mobile Relation Toggle */}
                <div className="flex md:hidden items-center bg-slate-100 p-1 rounded-lg border border-slate-200 w-full">
                  <button
                    onClick={() => setRelationType('LiderEstructuraDocumento')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      relationType === 'LiderEstructuraDocumento' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Por Líder
                  </button>
                  <button
                    onClick={() => setRelationType('RecomendanteDocumento')}
                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                      relationType === 'RecomendanteDocumento' 
                        ? 'bg-white text-indigo-700 shadow-sm' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Por Recomendante
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200">
                {filteredTree.length > 0 ? (
                  filteredTree.map(person => (
                    <TreeNode 
                      key={person.DocumentoDeIdentidad} 
                      person={person} 
                      onSelect={(p) => {
                        setSelectedPerson(p);
                        if (window.innerWidth < 768) {
                          setIsMobileMenuOpen(false);
                        }
                      }}
                      selectedId={selectedPerson?.DocumentoDeIdentidad}
                      defaultExpanded={searchTerm.length > 0}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    No se encontraron resultados para "{searchTerm}"
                  </div>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
                <span>Total registros: {data.length}</span>
                <span>Nodos raíz: {treeData.length}</span>
              </div>
            </div>

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
              <div 
                className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm z-10 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
            )}

            {/* Details Panel */}
            <div className="flex-1 bg-slate-50 p-4 md:p-6 lg:p-8 overflow-hidden">
              <div className="h-full max-w-4xl mx-auto">
                <DetailsPanel person={selectedPerson} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
