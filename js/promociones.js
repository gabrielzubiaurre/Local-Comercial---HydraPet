// js/promociones.js

document.addEventListener('DOMContentLoaded', () => {
    const btnCalcular = document.getElementById('btn-calcular');
    const subtotalEl = document.getElementById('subtotal');
    const descuentosEl = document.getElementById('descuentos');
    const totalFinalEl = document.getElementById('total-final');

    if (!btnCalcular || !subtotalEl || !descuentosEl || !totalFinalEl) {
        // Si falta algo en el HTML, no hacemos nada
        return;
    }

    const inputsCantidad = document.querySelectorAll('input[type="number"][data-precio]');

    const formatoPesos = new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        maximumFractionDigits: 0
    });

    function formatear(valor) {
        return formatoPesos.format(Math.round(valor));
    }

    btnCalcular.addEventListener('click', () => {
        let subtotal = 0;
        let descuentoPorProducto = 0;

        inputsCantidad.forEach(input => {
            const precio = Number(input.dataset.precio) || 0;
            const cantidad = Math.max(0, parseInt(input.value, 10) || 0);

            if (cantidad === 0 || precio <= 0) return;

            const subtotalLinea = precio * cantidad;
            subtotal += subtotalLinea;

            // Promos por producto:
            // 4x3: por cada 4 unidades, se descuenta el valor de 1 unidad
            const descuento4x3 = Math.floor(cantidad / 4) * precio;

            // 25% de descuento en el segundo al llevar 2:
            // por cada par, se descuenta 25% de una unidad
            const descuentoSegundo = Math.floor(cantidad / 2) * (precio * 0.25);

            // Para no superponer promos en las mismas unidades,
            // usamos la que más convenga para esa cantidad
            const descuentoLinea = Math.max(descuento4x3, descuentoSegundo);

            descuentoPorProducto += descuentoLinea;
        });

        // Total luego de aplicar promos por producto
        let totalDespuesDeProductos = subtotal - descuentoPorProducto;

        // 20% de descuento adicional si supera 150.000
        let descuento20 = 0;
        if (totalDespuesDeProductos > 150000) {
            descuento20 = totalDespuesDeProductos * 0.20;
        }

        const totalDescuentos = descuentoPorProducto + descuento20;
        const totalFinal = totalDespuesDeProductos - descuento20;

        // Actualizar pantalla
        subtotalEl.textContent = formatear(subtotal);
        descuentosEl.textContent = totalDescuentos > 0
            ? '-' + formatear(totalDescuentos)
            : formatear(0);
        totalFinalEl.textContent = formatear(totalFinal);
    });
});