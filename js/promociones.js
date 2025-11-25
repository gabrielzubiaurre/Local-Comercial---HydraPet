// js/promociones.js

document.addEventListener('DOMContentLoaded', function () {
    // Tomamos los elementos del HTML
    const btnCalcular  = document.getElementById('btn-calcular');
    const subtotalEl   = document.getElementById('subtotal');
    const descuentosEl = document.getElementById('descuentos');
    const totalFinalEl = document.getElementById('total-final');

    // Si falta algo importante, no seguimos
    if (!btnCalcular || !subtotalEl || !descuentosEl || !totalFinalEl) {
        return;
    }

    // Todos los inputs con precio
    const inputsCantidad = document.querySelectorAll('input[type="number"][data-precio]');

    // Para mostrar en pesos argentinos sin decimales
    const formatoPesos = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    });

    function formatear(valor) {
        return formatoPesos.format(Math.round(valor));
    }

    // Cuando se hace click en "Calcular total"
    btnCalcular.addEventListener('click', function () {
        let subtotal = 0;
        let descuentoPorProducto = 0;

        // Recorremos cada producto
        inputsCantidad.forEach(function (input) {
            const precio = Number(input.dataset.precio) || 0;
            const cantidad = Math.max(0, parseInt(input.value, 10) || 0);

            if (cantidad === 0 || precio <= 0) {
                return; // si no pidió nada de este producto, lo saltamos
            }

            // Sumamos al subtotal (sin descuentos)
            const subtotalLinea = precio * cantidad;
            subtotal += subtotalLinea;

            // --- Promos por producto ---

            // 4x3: por cada 4 unidades, una es gratis
            const descuento4x3 = Math.floor(cantidad / 4) * precio;

            // 25% de descuento en el segundo al llevar 2:
            // por cada par, 25% de 1 unidad
            const pares = Math.floor(cantidad / 2);
            const descuentoSegundo = pares * (precio * 0.25);

            // Usamos la promo que más descuento dé para este producto
            const descuentoLinea = Math.max(descuento4x3, descuentoSegundo);

            descuentoPorProducto += descuentoLinea;
        });

        // Total después de las promos por producto
        let totalDespuesDeProductos = subtotal - descuentoPorProducto;

        // 20% de descuento extra si supera 150.000
        let descuento20 = 0;
        if (totalDespuesDeProductos > 150000) {
            descuento20 = totalDespuesDeProductos * 0.20;
        }

        const totalDescuentos = descuentoPorProducto + descuento20;
        const totalFinal = totalDespuesDeProductos - descuento20;

        // Actualizamos los números en pantalla
        subtotalEl.textContent = formatear(subtotal);
        descuentosEl.textContent = totalDescuentos > 0
            ? '-' + formatear(totalDescuentos)
            : formatear(0);
        totalFinalEl.textContent = formatear(totalFinal);
    });
});