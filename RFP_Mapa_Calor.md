# Request for Proposal (RFP) - Sistema de Mapa de Calor de Incidencias

## 1. Resumen del Proyecto
El presente Request for Proposal (RFP) tiene como objetivo solicitar propuestas para el diseño, desarrollo, e implementación de un software de sistema de mapa de calor. Este sistema permitirá visualizar y analizar geográficamente los daños registrados y las llamadas de soporte recibidas en el canal de atención (4200-135).

## 2. Objetivo del Proyecto
El objetivo principal del sistema es visualizar y analizar de manera geográfica las incidencias reportadas por los clientes, con la finalidad de identificar zonas con comportamientos anómalos o inusuales de fallas. Esto facilitará la detección rápida y precisa de áreas críticas, mejorando la toma de decisiones y permitiendo la priorización eficiente de acciones correctivas.

## 3. Alcance del Sistema
El alcance técnico incluye:
- Integración en tiempo real o en batch periódico con el sistema fuente **SmartFlex** para la extracción de datos.
- Georreferenciación de las incidencias reportadas por los clientes (distritos, zonas, coordenadas).
- Interfaz gráfica web interactiva para visualizar el mapa de calor de las incidencias.
- Motor de análisis para la comparación entre "comportamiento anómalo" vs "día normal de atención".
- Módulo de reportes automatizados (diarios, semanales, y mensuales).

## 4. Requerimientos Funcionales
1. **Integración de Datos:** 
   - Capacidad de importar y consumir datos desde el sistema SmartFlex.
   - Registro y procesamiento de llamadas del canal de soporte (4200-135).
   - Captura de campos clave: producto afectado, número de carnet del cliente, información técnica asociada, fecha y hora de la incidencia.
2. **Geolocalización:**
   - Procesamiento de la información de entrada para ubicar geográficamente cada incidencia (por daño registrado o llamada).
   - Agrupamiento e identificación de puntos específicos dentro de distritos y zonas predefinidas.
3. **Visualización de Mapa de Calor (Heatmap):**
   - Interfaz de usuario con un mapa interactivo (zoom in/out, filtros por fecha, tipo de producto, zona).
   - Representación visual escalonada (colores) basada en la densidad y concentración de incidencias.
4. **Análisis de Anomalías:**
   - Algoritmo o reglas de negocio para determinar y alertar sobre una concentración inusual de incidencias respecto a una línea base ("día normal de atención").
5. **Módulo de Reportes:**
   - Generación de reportes predefinidos: Diarios, Semanales y Mensuales.
   - Posibilidad de exportación de la información visual y tabular (PDF, Excel, CSV).

## 5. Requerimientos No Funcionales
1. **Escalabilidad y Rendimiento:** El sistema debe ser capaz de procesar grandes volúmenes de datos asociados a miles de llamadas concurrentes o diarias sin degradación del rendimiento gráfico en el mapa.
2. **Seguridad:** Protección de la información personal de los clientes (número de carnet, etc.) según las normativas de protección de datos vigentes. Control de acceso mediante roles (ej. Administrador, Analista de Soporte, Supervisor).
3. **Usabilidad:** Interfaz intuitiva y fácil de usar, enfocada en la visualización rápida de alertas para la toma de decisiones gerenciales u operativas.
4. **Disponibilidad:** Alta disponibilidad, dado que es una herramienta de soporte analítico.

## 6. Entregables Esperados
- Documento de Arquitectura de Software e Integración con SmartFlex.
- Código fuente y binarios del sistema implementado.
- Manual Técnico y Manual de Usuario.
- Capacitación para el personal técnico y de soporte.
- Periodo de soporte post-implementación (Garantía).

## 7. Criterios de Evaluación
Las propuestas serán evaluadas según:
- Experiencia de la empresa en proyectos de sistemas de información geográfica (SIG/GIS) y visualización de datos.
- Propuesta técnica y arquitectura de la solución propuesta.
- Cronograma estimado de implementación.
- Costo total de propiedad (TCO), desglosado en desarrollo, licencias (si aplica) y soporte.

## 8. Calendario
*(A definir por la organización: Fechas de recepción de preguntas, entrega de propuestas, evaluaciones y adjudicación del proyecto).*
