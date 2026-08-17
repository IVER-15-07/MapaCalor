import { useEffect, useMemo, useState } from "react";
import { incidenciasService } from "../../api/incidencias/incidencias";
import { getTodayISO, mapSectorNamesToPoints } from "../../components/mapa/mapUtils";

export const useMapa = () => {
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [activePoints, setActivePoints] = useState([]);
  const [backendSectorCount, setBackendSectorCount] = useState(0);
  const [backendIncidentCount, setBackendIncidentCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [zoom, setZoom] = useState(12);

  // 🔹 Procesa el listado plano de incidencias devuelto por la API
  // y lo agrupa por sector para contarlos y mapearlos a coordenadas
  const processIncidentsData = (apiResponse) => {
    try {
      setError('');
      const incidencias = apiResponse?.data || [];

      // Agrupar cantidad de incidencias por nombre de sector
      const sectorMap = {};
      incidencias.forEach((row) => {
        const sectorName = row.sector_operativo || row.sector || 'Desconocido';
        sectorMap[sectorName] = (sectorMap[sectorName] || 0) + 1;
      });

      // Convertir a formato [{ sector: "Zona Norte", cantidad: 5 }, ...]
      const llamadasPorSector = Object.entries(sectorMap).map(([sector, llamadas]) => ({
        sector,
        llamadas,
        total_llamadas: llamadas
      }));

      // Mapear a puntos geográficos con coordenadas
      const points = mapSectorNamesToPoints(llamadasPorSector);

      setBackendIncidentCount(incidencias.length);
      setBackendSectorCount(Object.keys(sectorMap).length);
      setActivePoints(points);
      setSelectedPoint(null);
    } catch (err) {
      setBackendSectorCount(0);
      setBackendIncidentCount(0);
      setActivePoints([]);
      setError(err.message || 'Error al procesar los datos del mapa');
    } finally {
      setLoading(false);
    }
  };

  // 1. Inicialización: Carga las incidencias del día actual
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const data = await incidenciasService.getIncidenciasByDay(getTodayISO());
        processIncidentsData(data);
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del mapa');
        setLoading(false);
      }
    };
    init();
  }, []);

  // 2. Consulta por día ('YYYY-MM-DD')
  const handleConsultaDay = async (date) => {
    setSelectedDate(date);
    setLoading(true);
    try {
      const data = await incidenciasService.getIncidenciasByDay(date);
      processIncidentsData(data);
    } catch (err) {
      setError(err.message || 'Error al consultar por día');
      setLoading(false);
    }
  };

  // 3. Consulta por mes (recibe "YYYY-MM" y lo divide para el Backend)
  const handleConsultaMonth = async (monthStr) => {
    setSelectedDate(monthStr);
    setLoading(true);
    try {
      const [anioStr, mesStr] = monthStr.split('-');
      const anio = parseInt(anioStr, 10);
      const mes = parseInt(mesStr, 10);

      const data = await incidenciasService.getIncidenciasByMonth(anio, mes);
      processIncidentsData(data);
    } catch (err) {
      setError(err.message || 'Error al consultar por mes');
      setLoading(false);
    }
  };

  // 4. Consulta por rango de fechas
  const handleConsultaRange = async (from, to) => {
    setSelectedDate(`${from} → ${to}`);
    setLoading(true);
    try {
      const data = await incidenciasService.getIncidenciasByRange(from, to);
      processIncidentsData(data);
    } catch (err) {
      setError(err.message || 'Error al consultar por rango');
      setLoading(false);
    }
  };

  // Valores calculados
  const totalIncidents = useMemo(
    () => activePoints.reduce((sum, p) => sum + (p.incidents || p.llamadas || 0), 0),
    [activePoints]
  );

  const sectorCount = activePoints.length;

  return {
    // Estados
    selectedDate,
    activePoints,
    backendSectorCount,
    backendIncidentCount,
    loading,
    error,
    selectedPoint,
    zoom,

    // Setters
    setSelectedPoint,
    setZoom,

    // Acciones
    handleConsultaDay,
    handleConsultaMonth,
    handleConsultaRange,

    // Derivados
    totalIncidents,
    sectorCount
  };
};