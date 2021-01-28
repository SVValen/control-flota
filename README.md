# SISEP Control de Flota
Modulo del SISEP para controlar el mantenimiento de las flotas de moviles.

## TODO
- Choferes ver si hay que hacerles un tratamiento diferente que a los moviles...
- Definir eventos (pantallas)


## Resumen
Este modulo toma los moviles ya cargados en el SISEP y les agrega la opcion de controlar diferentes variables ya sea por fechas limite, periodos de tiempo o kilometros.

Para cada movil se le pueden agregar reglas como por ejemplo:
- cambiar el aceite cada 10.000 Kms o 12 meses.
- renovar la VTV a partir de cierta fecha.

## Base de datos
A todas las tablas se les agrega tambien borrado y fechaActualizacion...

### Grupo
Agrupa los servicios que se pueden realizar segun los tipos de moviles, seguramente estara bastante relacionado con la Marca, Modelo y o el año, o el tipo de uso, etc...
- grupId
- grupNombre
- grupDescripcion

### Servicio
Diferentes servicios que pueden hacerse a los moviles. Los servicios pueden ser programados periodicamente por tiempo, por Kms o bien tener simplemente una fecha limite. Tambien pueden ser 
- servId
- servNombre
- servDescripcion
- servPeriodo: numero de dias periodicos por defecto
- servKM: numero de KMs por defecto
- servFecha: bool si se controla una fecha limite. O sea no se usa un periodo sino que simplemente se pide la proxima fecha. Ejemplo la VTV o el carnet de conducir.

### Tarea
Lista opcional de tareas posibles que se realizan en un servicio. Ejemplo cambio de aceite, cambio de filtros, reparacion x, etc.. Cuando se reliza un servicio en un movil se toma esta lista como ejemplo pero despues se le pueden cargar mas.
- tareId
- tareNombre
- tareDescripcion
- tareUnidadMedida unidades, litros, gramos,  etc
- tareCantidad cantidad por defecto o cero
- tareCosto costo por defecto de la tarea

### ServicioTarea
Template de las tareas tipicas por defecto de un servicio
- setaId
- setaServId servicio
- setaTareId tarea

### GrupoServicio
Template de los diferentes servicios para cada grupo de moviles.
- grusId
- grusGrupId grupo
- grusServId servicio
- grusPeriodo: numero de dias por defecto en este grupo
- grusKM: numero de KMs por defecto en este grupo
- grusFecha: bool si se controla una fecha limite


### MovilServicio
Servicios programados para un movil. Es una copia del template de GrupoServicios para cada movil. Al asignar el grupo al movil se le dan de alta estos servicios con sus valores por defecto, pero en cada movil se podrian cambiar o agregar alguno mas.
- moseId
- moseMoviId movil
- moseServId servicio
- mosePeriodo: numero de dias
- moseKM: numero de KMs
- moseFecha: bool si se controla una fecha limite

### MovilBitacora
Log de todos los servicios y controles que se le realizan a un movil. Esta tabla tambien se usa para ver todos los controles programados **Pendientes** que estan vencidos o por vencer segun **ProximaFecha o ProximoOdometro**.
- mobiId
- mobiMoseId servicio programado. Podria estar en NULL si se hizo un servicio no programado.
- mobiServId servicio
- mobiFecha fecha del servicio 
- mobiObservaciones
- mobiOdometro odometro del movil al momento del servicio
- mobiProximoOdometro se calcula segun moseKM
- mobiProximaFecha se calcula segun mosePeriodo o se carga si moseFecha=1
- mobiIdAnterior servicio anterior, puede estae en null si es el primero o es no programado
- mobiIdSiguiente servicio siguiente, esta en null hasta que no se haga el proximo servicio
- mobiPendiente esta en 1 hasta que no se haga el prox. servicio.

### BitacoraTarea
Tareas especificas realizadas durante el servicio al movil, se suguieren desde ServicioTareas + Tareas
- bitaId
- bitaMobiId MovilBitacora
- bitaTareId Tarea
- bitaObservaciones
- bitaCantidad  
- bitaCosto se suguiere desde Tarea


### MovilOdometro
Log de Odometros diarios por movil. Al cargar uno nuevo se registra el ultimo en el Movil.
- modoId
- modoMoviId
- modoFecha
- modoOdometro

### MovilGrupo
Por si el movil puede estar en mas de un grupo...
- mogrId
- mogrMoviId movil
- mogrGrupId: grupo de moviles

### Movil
En esta tabla se agregan todos los moviles a los que se les va a hacer mantenimiento preventivo. Se relaciona por idmovil con la tabla [AVL_Estructura].[dbo].[Movil].

- moviId: relacion 1:1 con AVL_Estructura.dbo.Movil
- moviModoFecha: copia del ultimo odometro
- moviModoOdometro

Estos campos estan en la tabla relacionada de AVL_Estructura. 

Para visualizar:
- activa
- patente
- compid + Comp.Nombre
- tipomovilid + TipoMovil.Nombre
- tienepatrullaje
- borrado
- fechaalta

Pueden Editarse, segun permisos:
- descripcion
- marca
- modelo
- anio
- chasis
- numeromovil
- color
- seguro
- poliza
- numeromotor
- movilestadoid + MovilEstado.Estado



## Eventos (pantallas)

- Grilla de Grupos
  - Form de Grupos
    - GrupoServicios
- Grilla de Servicios
  - Form de Servicios
    - ServicioTareas
- Grilla de Tareas
  - Form de Tareas
- Grilla (buscador) de Moviles
  - Alta de Movil
  - Edicion del Movil
    - MovilGrupos
  - Mantenimiento del Movil
    - MovilServicios
    - MovilBitacora
      - BitacoraTareas
    - MovilOdometro
- Proximos vencimientos
