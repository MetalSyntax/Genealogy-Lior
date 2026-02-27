import Papa from 'papaparse';

export interface Person {
  Actividades: string;
  Referencia: string;
  DocumentoDeIdentidad: string;
  Nombre: string;
  Posicion: string;
  LiderEstructuraRIF: string;
  LiderEstructuraDocumento: string;
  LiderEstructura: string;
  RecomendanteRIF: string;
  RecomendanteDocumento: string;
  Recomendante: string;
  Tarifa: string;
  Pais: string;
  Ciudad: string;
  Comercial: string;
  Compania: string;
  Correo: string;
  RIF: string;
  Telefono: string;
  IdentificacionFiscal: string;
  TipoDeContacto: string;
  children?: Person[];
}

export const parseCsv = (csvText: string): Person[] => {
  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    delimiter: ';',
  });

  return result.data.map((row: any) => ({
    Actividades: row['Actividades'] || '',
    Referencia: row['Referencia'] || '',
    DocumentoDeIdentidad: row['Documento de Identidad'] || '',
    Nombre: row['Nombre'] || '',
    Posicion: row['Posición'] || '',
    LiderEstructuraRIF: row['Líder Estructura/RIF'] || '',
    LiderEstructuraDocumento: row['Líder Estructura/Documento de Identidad'] || '',
    LiderEstructura: row['Líder Estructura'] || '',
    RecomendanteRIF: row['Líder Estructura/Recomendante/RIF'] || '',
    RecomendanteDocumento: row['Líder Estructura/Recomendante/Documento de Identidad'] || '',
    Recomendante: row['Recomendante'] || '',
    Tarifa: row['Tarifa'] || '',
    Pais: row['País'] || '',
    Ciudad: row['Ciudad'] || '',
    Comercial: row['Comercial'] || '',
    Compania: row['Compañía'] || '',
    Correo: row['Correo electrónico'] || '',
    RIF: row['RIF'] || '',
    Telefono: row['Teléfono'] || '',
    IdentificacionFiscal: row['Identificación fiscal'] || '',
    TipoDeContacto: row['Tipo de contacto'] || '',
  }));
};

export const buildTree = (data: Person[], parentKey: 'LiderEstructuraDocumento' | 'RecomendanteDocumento'): Person[] => {
  const map = new Map<string, Person>();
  const roots: Person[] = [];

  // Initialize map
  data.forEach(person => {
    if (person.DocumentoDeIdentidad) {
      map.set(person.DocumentoDeIdentidad, { ...person, children: [] });
    }
  });

  // Build tree
  data.forEach(person => {
    if (!person.DocumentoDeIdentidad) return;
    
    const node = map.get(person.DocumentoDeIdentidad)!;
    const parentId = person[parentKey];
    
    if (parentId && parentId !== person.DocumentoDeIdentidad && map.has(parentId)) {
      map.get(parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });

  return roots;
};
