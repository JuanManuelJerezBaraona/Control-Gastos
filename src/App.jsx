import { useState, useEffect } from 'react'
import Header from "./components/Header"
import Filtros from "./components/Filtros"
import Modal from './components/Modal'
import ListadoGastos from './components/ListadoGastos'
import {generarId} from "./helpers"
import IconoNuevoGasto from "./img/nuevo-gasto.svg"
import { object } from 'prop-types'

function App() {

  // HOOKS DE ESTADO

  // Esta variable de estado contiene una matriz de gastos. Se inicializa con datos del almacenamiento local (si están disponibles) o con una matriz vacía.
  const [gastos, setGastos] = useState(
    localStorage.getItem("gastos") ? JSON.parse(localStorage.getItem("gastos")) : []
  )

  // Esta variable de estado almacena el valor del presupuesto, que se obtiene del almacenamiento local. Si no está disponible, el valor predeterminado es 0.
  const [presupuesto, setPresupuesto] = useState(
    Number(localStorage.getItem("presupuesto")) ?? 0
  );

  // Esta variable de estado indica si el valor del presupuesto es válido (mayor que 0).
  const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);

  // Esta variable de estado determina si el modal (ventana emergente) para agregar/editar gastos está abierto o no.
  const [modal, setModal] = useState(false);

  // Esta variable de estado se utiliza para controlar las animaciones del modal.
  const [animarModal, setAnimarModal] = useState(false);

  // Esta variable de estado almacena los datos del gasto que se está editando en el modal.
  const [gastoEditar, setGastoEditar] = useState({})

  // Esta variable de estado almacena la categoría de filtro actual para los gastos.
  const [filtro, setFiltro] = useState("")

  //  Esta variable de estado contiene los gastos filtrados en función de la categoría seleccionada.
  const [gastosFiltrados, setGastosFiltrados] = useState([])

  // HOOKS DE EFECTO

  // Está pendiente de los cambios en el estado gastoEditar. Cuando se establece un gasto para editar, abre el modal con una animación.
  useEffect(() => {
    if(Object.keys(gastoEditar).length > 0) {
        setModal(true)

        setTimeout(() =>{
          setAnimarModal(true)
        }, 500)
    }
  }, [gastoEditar])

  // Observa los cambios en el estado presupuesto y lo guarda en el almacenamiento local.
  useEffect(() => {
    localStorage.setItem("presupuesto", presupuesto ?? 0)
  }, [presupuesto])

  // Está pendiente de los cambios en el estado gastos y guarda los gastos actualizados en el almacenamiento local.
  useEffect(() => {
    localStorage.setItem("gastos", JSON.stringify(gastos) ?? [])
  }, [gastos])

  // FALTA AGREGAR COMENTARIOS
  useEffect(() => {
    if(filtro) {
      const gastosFiltrados = gastos.filter(gasto => gasto.categoria === filtro)

      setGastosFiltrados(gastosFiltrados)
    }
  }, [filtro])

  // Inicializa el estado isValidPresupuesto al comprobar si el presupuesto almacenado es mayor que 0.
  useEffect(() => {
    const presupuestoLS = Number(localStorage.getItem("presupuesto")) ?? 0

    if(presupuestoLS > 0) {
      setIsValidPresupuesto(true)
    }
  }, [])

  // FUNCIONES

  // Esta función se llama cuando un usuario desea agregar un nuevo gasto. Abre el modal con una animación y borra los datos de gastoEditar.
  const handleNuevoGasto = () => {
    setModal(true)
    setGastoEditar({})

    setTimeout(() =>{
      setAnimarModal(true)
    }, 500)
  }

  // Esta función se utiliza para guardar o actualizar un gasto. Si el gasto tiene un id, actualiza el gasto existente; de lo contrario, crea uno nuevo. Después de guardar, cierra el modal con una animación.
  const guardarGasto = gasto => {
    if(gasto.id) {
      // Actualizar
      const gastosActualizados = gastos.map(gastoState => gastoState.id === gasto.id ? gasto : gastoState)
      setGastos(gastosActualizados)
    } else {
      // Nuevo gasto
      gasto.id = generarId()
      gasto.fecha = Date.now()
      setGastos([...gastos, gasto])
      setGastoEditar({})
    } 
    setAnimarModal(false)
        setTimeout(() => {
            setModal(false)
        }, 500)
  }

  // Esta función elimina un gasto filtrando el gasto con el id especificado.
  const eliminarGasto = id => {
    const gastosActualizados = gastos.filter(gasto => gasto.id !== id)
    setGastos(gastosActualizados)
  }

  // El componente Header se encarga de mostrar la información del presupuesto y permite a los usuarios modificarlo.
  // El componente Filtros proporciona un menú desplegable para filtrar gastos por categoría.
  // El componente ListadoGastos muestra una lista de gastos según el filtro seleccionado.
  // El botón "Nuevo Gasto" activa la función handleNuevoGasto para abrir el modal.
  // El componente Modal se renderiza condicionalmente cuando el estado modal es true. Muestra una ventana emergente para agregar o editar gastos.
  return (
    <div className={modal ? "fijar" : ""}>
      <Header
        gastos={gastos}
        setGastos={setGastos}
        presupuesto={presupuesto}
        setPresupuesto={setPresupuesto}
        isValidPresupuesto={isValidPresupuesto}
        setIsValidPresupuesto={setIsValidPresupuesto}
      />

      {isValidPresupuesto && (
        <>
          <main>
            <Filtros 
              filtro={filtro}
              setFiltro={setFiltro}
            />
            <ListadoGastos 
              gastos={gastos}
              setGastoEditar={setGastoEditar}
              eliminarGasto={eliminarGasto}
              filtro={filtro}
              gastosFiltrados={gastosFiltrados}
            />
          </main>
          <div className='nuevo-gasto'>
            <img 
              src={IconoNuevoGasto} 
              alt="ícono nuevo gasto" 
              onClick={handleNuevoGasto}
            />
          </div>
        </>
      )}

      {modal && <Modal 
                  setModal={setModal}
                  animarModal={animarModal}
                  setAnimarModal={setAnimarModal}
                  guardarGasto={guardarGasto}
                  gastoEditar={gastoEditar}
                  setGastoEditar={setGastoEditar}
                  />}
      
    </div>
  )
}

export default App
