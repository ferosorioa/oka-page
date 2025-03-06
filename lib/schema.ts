// Define your database schema information based on the actual Supabase tables
export const DB_SCHEMA = `
Tables:
- clientes_b2b(id, empresa, rfc, contacto_principal, website, notas, created_at)
- clientes_b2c(id, nombre, telefono, email, calle, numero, colonia, delegacion, ciudad, estado, cp, pais, created_at, rfc)
- contactos(id, cliente_b2b_id, nombre, email, telefono, puesto)
- egresos(id, b2b_cliente_id, tipo, concepto, proveedor, monto, metodo_pago, fecha, notas, created_at)
- ingresos(id, cliente_id, cliente_tipo, monto, fecha, nota)
- oka_egresos(id, tipo, concepto, actor, proveedor, monto, metodo, cuenta, fecha, notas)
- oka_ingresos(id, canal, donde, producto, recibe, ingreso, metodo, cuenta, fecha, nota, tipo_venta)
- productos(id, nombre, descripcion, precio, costo, stock, created_at, image)
- proveedores(id, created_at, name)
- types_expense(id, created_at, name)
- ubicaciones_compras(id, nombre, ciudad, estado, pais, created_at)
- ventas(id, cliente_id, ubicacion_id, precio_total, fecha)
- ventas_detalle(id, venta_id, producto_id, cantidad, precio_unitario, subtotal)

Relationships:
- ventas_detalle.venta_id references ventas.id
- ventas_detalle.producto_id references productos.id
- ventas.cliente_id references clientes_b2c.id or clientes_b2b.id (depending on the client type)
- ventas.ubicacion_id references ubicaciones_compras.id
- egresos.tipo references types_expense.id
- egresos.proveedor references proveedores.id
- contactos.cliente_b2b_id references clientes_b2b.id
`;