import { pool } from '../../db.js'


//* agregar proveedorq
export const addProveedor = async (req, res) => {
    const { proveedor_razon_social, proveedor_contacto, proveedor_contacto_email, proveedor_telefono, proveedor_direccion, proveedor_rfc, proveedor_web, proveedor_usuario_password, proveedor_dias_credito, proveedor_limite_credito, proveedor_tipo_id } = req.body
    const hoy = new Date()
    const proveedor_fecha_alta = hoy.getFullYear() + '-' + (hoy.getMonth() + 1) + '-' + hoy.getDate()
    try {
        await pool.query('INSERT INTO proveedores set ?', [req.body])
        req.flash('success', { title: 'Proveedor agregado', message: 'La marca se ha agregado correctamente' })
        return res.redirect('/dashboard/administracion/proveedores/nuevo')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'El proveedor ' + proveedor_razon_social + ' ya existe' })
        return res.redirect('/dashboard/administracion/proveedores/nuevo')
    }
}
//! fin agregar proveedor


//* editar proveedor
export const updProveedor = async (req, res) => {
    const { proveedor_razon_social, proveedor_contacto, proveedor_contacto_email, proveedor_telefono, proveedor_direccion, proveedor_rfc, proveedor_web, proveedor_usuario_password, proveedor_dias_credito, proveedor_limite_credito, proveedor_tipo_id } = req.body
    
    try {
        await pool.query('UPDATE proveedores set ? WHERE proveedor_id = ?', [req.body, req.params.id])
        req.flash('success', { title: 'Proveedor actualizado', message: 'El proveedor se ha actualizado correctamente' })
        return res.redirect('/dashboard/administracion/proveedores/buscar')
    } catch (error) {
        req.flash('error', { title: 'Ooops!', message: 'El proveedor ' + proveedor_razon_social + ' ya existe' })
        return res.redirect('/dashboard/administracion/proveedores/buscar')
    }
}
//! fin editar proveedor

//* eliminar proveedor
export const delProveedor = async (req, res) => {
    const { id } = req.params.id
    try {
        await pool.query('DELETE FROM proveedores WHERE proveedor_id = ?', [req.params.id])
        return res.status(200).json({ message: 'El proveedor se ha eliminado correctamente', status: 200 })
    } catch (error) {
        return res.status(500).json({ message: 'El proveedor no se puede eliminar', status: 500 })
    }
}

//! fin eliminar proveedor
