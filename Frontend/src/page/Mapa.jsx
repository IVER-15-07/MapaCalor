import { useMapa } from '../hooks/useMapa/useMapa'
import { MapHeader } from '../components/mapa/MapHeaderNew'
import { MapDisplay } from '../components/mapa/MapDisplay'
import { MapSidebar } from '../components/mapa/MapSidebar'

const Mapa = () => {

  const {
    zoom, setZoom,
    loading, error,
    backendSectorCount, backendIncidentCount,
    selectedDate,
    selectedPoint, setSelectedPoint,
    activePoints,
    totalIncidents, sectorCount,
    handleConsultaDay,
    handleConsultaMonth,
    handleConsultaRange
  } = useMapa()
  return (
    <div className="flex h-full flex-col gap-6 xl:flex-row xl:items-stretch">

      <div className="flex min-w-0 flex-[1.7] flex-col">
        <MapHeader
          zoom={zoom}
          setZoom={setZoom}
          loading={loading}
          error={error}
          backendSectorCount={backendSectorCount}
          backendIncidentCount={backendIncidentCount}
          onConsultaDay={handleConsultaDay}
          onConsultaMonth={handleConsultaMonth}
          onConsultaRange={handleConsultaRange}
        />

        <MapDisplay
          zoom={zoom}
          selectedPoint={selectedPoint}
          activePoints={activePoints}
          handlePointSelect={setSelectedPoint}
          metricLabelTitle="Incidencias"
          sectorCount={sectorCount}
          totalIncidents={totalIncidents}
          metricLabel="incidencias"
          sourceMode="smarflex"
        />
      </div>

      <MapSidebar
        sectorCount={sectorCount}
        selectedDate={selectedDate}
        selectedPoint={selectedPoint}
        setSelectedPoint={setSelectedPoint}
        metricLabelTitle="Incidencias"
        activePoints={activePoints}
        handlePointSelect={setSelectedPoint}
      />
    </div>
  )
}

export default Mapa