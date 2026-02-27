import React from 'react';
import { Person } from '../utils/parseCsv';
import { User, Mail, Phone, MapPin, Briefcase, Hash, Shield, Users } from 'lucide-react';

interface DetailsPanelProps {
  person: Person | null;
}

export const DetailsPanel: React.FC<DetailsPanelProps> = ({ person }) => {
  if (!person) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <Users size={32} className="text-slate-300" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">Ningún perfil seleccionado</h3>
        <p className="text-sm">Selecciona una persona en el árbol genealógico para ver sus detalles completos.</p>
      </div>
    );
  }

  const DetailItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
      <div className="mt-0.5 text-indigo-500 bg-indigo-50 p-2 rounded-lg">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
        <p className="text-sm text-slate-900 font-medium">{value || 'No especificado'}</p>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
            <User size={32} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{person.Nombre}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                {person.Posicion || 'Sin Posición'}
              </span>
              <span className="text-sm text-slate-500 font-mono">ID: {person.DocumentoDeIdentidad}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Shield size={16} className="text-slate-400" />
            Información Personal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DetailItem icon={Hash} label="Documento de Identidad" value={person.DocumentoDeIdentidad} />
            <DetailItem icon={Hash} label="RIF" value={person.RIF} />
            <DetailItem icon={Mail} label="Correo Electrónico" value={person.Correo} />
            <DetailItem icon={Phone} label="Teléfono" value={person.Telefono} />
            <DetailItem icon={MapPin} label="Ubicación" value={`${person.Ciudad ? person.Ciudad + ', ' : ''}${person.Pais}`} />
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Briefcase size={16} className="text-slate-400" />
            Información Comercial
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <DetailItem icon={Briefcase} label="Compañía" value={person.Compania} />
            <DetailItem icon={Briefcase} label="Comercial" value={person.Comercial} />
            <DetailItem icon={Briefcase} label="Actividades" value={person.Actividades} />
            <DetailItem icon={Briefcase} label="Tarifa" value={person.Tarifa} />
            <DetailItem icon={Briefcase} label="Tipo de Contacto" value={person.TipoDeContacto} />
          </div>
        </div>

        <div className="h-px bg-slate-100 w-full" />

        <div>
          <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Users size={16} className="text-slate-400" />
            Estructura y Genealogía
          </h3>
          <div className="bg-slate-50 rounded-xl p-4 space-y-4 border border-slate-100">
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Líder de Estructura</p>
              <p className="text-sm font-medium text-slate-900">{person.LiderEstructura || 'N/A'}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {person.LiderEstructuraDocumento}</p>
            </div>
            <div className="h-px bg-slate-200 w-full" />
            <div>
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Recomendante</p>
              <p className="text-sm font-medium text-slate-900">{person.Recomendante || 'N/A'}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {person.RecomendanteDocumento}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
