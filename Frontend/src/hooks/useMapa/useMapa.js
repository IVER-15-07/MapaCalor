import { useEffect, useMemo, useState } from "react";
import { historialService } from "../../api/incidencias/Historial";
import { getTodayISO, mapSectorNamesToPoints } from "../../components/mapa/mapUtils";
export cosnt useMpa = () => {
    