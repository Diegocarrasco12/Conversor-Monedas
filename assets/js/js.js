let currentChart = null

const handleClick = async () => {
    const select = document.querySelector("#selectCurrency")
    const dinero = document.querySelector("#dinero")
    const errorMensaje = document.querySelector("#errorMensaje")

    if (!select.value || !dinero.value) {
        errorMensaje.innerText = "*Por favor, complete todos los campos antes de continuar"
        errorMensaje.style.display = "block"
        return
    }

    errorMensaje.style.display = "none"
    const endpoint = "https://mindicador.cl/api/" + select.value
    
    try {
        const res = await fetch(endpoint)

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`)
        }
        const data = await res.json()

        if (!data.serie) {
            throw new Error("Invalid data format")
        }
    
        const info = data.serie.slice(0, 10).reverse()
        const etiquetas = info.map(day => {
            return day.fecha.split('T')[0]
        })
        const valores = info.map(day => day.valor)
        const conversion = dinero.value / valores[valores.length - 1]
        
        document.querySelector("h2").innerText = "$" + conversion.toFixed(2)
        
        console.log("etiquetas", etiquetas)
        console.log("valores", valores)
    
        const ctx = document.querySelector("#myChart").getContext("2d")
    
        if (currentChart) {
            currentChart.destroy();
        }
    
        const dataChart = {
            labels: etiquetas,
            datasets: [
                {
                    label: 'Variaciones de moneda',
                    data: valores,
                    borderColor: 'rgb(75, 192, 192)',
                },
            ],
        }
    
        currentChart = new Chart(ctx, {
            type: 'line',
            data: dataChart,
            
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Fecha'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Valor'
                        }
                    }
                }
            }
            
        })
    } catch(error) {
        console.error("Error fetching or processing data: ", error)
        errorMensaje.innerText = "*Hubo un error al obtener los datos. Por favor, intente nuevamente."
        errorMensaje.style.display = "block"
    }
}

const btnBuscar = document.querySelector("#btn-buscar")
btnBuscar.addEventListener('click', handleClick)