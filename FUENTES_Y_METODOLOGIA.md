# ATLAS — Fuentes y metodología de datos

Esta ampliación conserva la interfaz original de ATLAS y añade propiedades al conjunto de datos de los 118 elementos.

## Fuentes de referencia

- PubChem, *Periodic Table of Elements* (National Library of Medicine): https://pubchem.ncbi.nlm.nih.gov/periodic-table/
- Bluegrams, *periodic-table-data / ElementData.csv*: https://github.com/Bluegrams/periodic-table-data/blob/master/Periodica.Data/Data/ElementData.csv
- PeriodicTable / ChemInfo, *Element data sheet*: https://periodic-table.cheminfo.org/data

Las fuentes ofrecen valores tabulados para propiedades como radio atómico, afinidad electrónica, densidad, estados de oxidación y abundancia. Los valores pueden variar ligeramente entre compilaciones por diferencias de método, temperatura, estado físico o definición.

## Criterios de interpretación

- **Carga nuclear efectiva (Zeff):** ATLAS la estima mediante una implementación de las reglas de Slater para un electrón externo. Es una aproximación didáctica, no un valor experimental universal. Las configuraciones electrónicas reales presentan excepciones y el Zeff depende del orbital elegido.
- **Radio atómico:** se expresa en picómetros (pm). El radio atómico no tiene una única definición; los valores dependen del método de medición y del tipo de radio tabulado.
- **Radio iónico:** se muestra un ion representativo y su radio aproximado. Este valor depende del estado de oxidación, número de coordinación y entorno cristalino; no debe interpretarse como una constante única del elemento.
- **Afinidad electrónica:** se expresa en kJ/mol. Se deja como no disponible cuando la fuente no ofrece un valor fiable o comparable. Los datos experimentales y las convenciones de signo pueden diferir entre fuentes.
- **Densidad:** se expresa en g/cm³. Para gases se usan valores cercanos a condiciones estándar; para algunos elementos superpesados no hay mediciones experimentales suficientes.
- **Abundancia natural:** se presenta como abundancia aproximada en la corteza terrestre, en ppm en masa, cuando existe un dato de referencia. No equivale a abundancia en el universo, en el océano o en el cuerpo humano.
- **Estados de oxidación:** se enumeran estados conocidos o comunes; no todos son igualmente estables ni aparecen en todos los compuestos.
- **Importancia económica e impacto ambiental:** son resúmenes orientativos. La toxicidad y el comportamiento ambiental dependen de la especie química, concentración, exposición, biodisponibilidad y persistencia; no es correcto clasificar automáticamente al elemento puro como contaminante.

## Datos no disponibles

Cuando una propiedad no tiene un valor suficientemente fiable, ATLAS muestra «No disponible» o «—» en lugar de inventar un dato. Esto es especialmente relevante para elementos sintéticos, superpesados o de vida media muy corta.
