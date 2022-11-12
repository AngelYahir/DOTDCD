import { pool } from '../../db.js'
import fs from 'fs';


export const addEmployee = async (req, res) => {
    try {
        
        await pool.query("INSERT INTO empleados SET ?", {
            empleado_id: req.body.id,
            empleado_nombre: (!req.body.empleado_nombre) ? 0 : req.body.empleado_nombre,
            empleado_paterno: (!req.body.empleado_paterno) ? 0 : req.body.empleado_paterno,
            empleado_materno: (!req.body.empleado_materno) ? 0 : req.body.empleado_materno,
            empleado_imss: (!req.body.empleado_imss) ? 0 : req.body.empleado_imss,
            empleado_nacimiento: (!req.body.empleado_nacimiento) ? 0 : req.body.empleado_nacimiento,
            empleado_entrada: (!req.body.empleado_entrada) ? 0 : req.body.empelado_entrada,
            empleado_direccion: (!req.body.empleado_direccion) ? 0 : req.body.empleado_direccion,
            empleado_telefono: (!req.body.empleado_telefono) ? 0 : req.body.empleado_telefono,
            empleado_email: (!req.body.empleado_email) ? 0 : req.body.empleado_email,
            empleado_centrodecostos_id: (!req.body.dentrodecostos_id) ? 0 : req.body.centrodecostos_id,
            empleado_puesto_id: (!req.body.empleado_puesto_id) ? 0 : req.body.empleado_puesto_id,
            empleado_sueldo: (!req.body.empleado_sueldo) ? 0 : req.body.empleado_sueldo,
            empleado_sueldo_imss: (!req.body.empleado_imss) ? 0 : req.body.empleado_sueldo_imss,
            empleado_cuenta_deposito: (!req.body.empleado_nombre) ? 0 : req.body.empleado_cuenta_deposito,
            empleado_cuenta_deposito_maquila: (!req.body.empleado_cuenta_deposito_maquila) ? 0 : req.body.empleado_cuenta_deposito_maquila,
            empleado_periodo_id: (!req.body.empleado_periodo_id) ? 0 : req.body.empleado_periodo_id,
            empleado_diario: (!req.body.empleado_diario) ? 0 : req.body.empleado_diario,
            empleado_rfc: (!req.body.empleado_rfc) ? 0 : req.body.empleado_rfc,
            empleado_curp: (!req.body.empleado_curp) ? 0 : req.body.empleado_curp,
            empleado_empresa_id: (!req.body.empleado_empresa_id) ? 0 : req.body.empleado_empresa_id,
            empleado_sexo_id: (!req.body.empleado_sexo_id) ? 0 : req.body.empleado_sexo_id,
            empleado_estado_civil_id: (!req.body.empleado_estado_civil_id) ? 0 : req.body.empleado_estado_civil_id,
            empleado_fecha_alta: (!req.body.empleado_fecha_alta) ? 0 : req.body.empleado_fecha_alta,
            empleado_ultima_modificacion: (!req.body.empleado_ultima_modificacion) ? 1 : req.body.empleado_ultima_modificacion,
            empleado_usuario: (!req.body.empleado_usuario) ? 0 : req.body.empleado_usuario,
            empleado_password: (!req.body.empleado_password) ? 0 : req.body.empleado_password,
            empleado_estatus_baja: (!req.body.empleado_estatus_baja) ? 0 : req.body.empleado_estatus_baja,
            empleado_fecha_baja: (!req.body.empleado_fecha_baja) ? 0 : req.body.empleado_fecha_baja,
            empleado_actividad_tipo: (!req.body.empleado_actividad_tipo) ? 0 : req.body.empleado_actividad_tipo,
            empleado_perfil_app: (!req.body.empleado_perfil_app) ? 0 : req.body.empleado_perfil_app,
            sucursal_id: (!req.body.sucursal_id) ? 0 : req.body.sucursal_id,
            tipo_indirecto_id: (!req.body.tipo_indirecto_id) ? 0 : req.body.tipo_indirecto_id,
            empleado_contacto_emergencia_nombre: (!req.body.empleado_contacto_emergencia_nombre) ? 0 : req.body.empleado_contacto_emergencia_nombre,
            empleado_contacto_emergencia_telefono: (!req.body.empleado_contacto_emergencia_telefono) ? 0 : req.body.empleado_contacto_emergencia_telefono
        })

        if (req.files) {
            req.files.map(async (file) => {
                await pool.query("INSERT INTO  USERS_FILES SET ?", { type: file.fieldname, file: file.filename, userId: req.body.id })
            })
        }

        return res.status(200).json('Archivo subido correctamente');
    } catch (error) {
        console.log(error)
        req.flash('error', {title: 'error', message: error});
        return res.redirect('/dashboard/contabilidad/empleados/nuevo');
    }
}

export const uptEmployee = async (req, res) => {
    try {
        const { id } = req.params

        if(req.files){
            req.files.map(async(file)=> {
                await pool.query('INSERT INTO USERS_FILES SET ? ON DUPLICATE KEY UPDATE file = ?', [{file: file.filename, type: file.fieldname, userId: id}, file.filename])
            })
        }
        // Exclude some item from req.body

        await pool.query('UPDATE empleados SET ? WHERE empleado_id = ?', [{
            empleado_nombre: req.body.empleado_nombre,
            empleado_paterno: req.body.empleado_paterno,
            empleado_materno: req.body.empleado_materno,
            empleado_imss: req.body.empleado_imss,
            empleado_nacimiento: req.body.empleado_nacimiento,
            empleado_entrada: req.body.empleado_entrada,
            empleado_direccion: req.body.empleado_direccion,
            empleado_telefono: req.body.empleado_telefono,
            empleado_email: req.body.empleado_email,
            empleado_centrodecostos_id: req.body.empleado_centrodecostos_id,
            empleado_puesto_id: req.body.empleado_puesto_id,
            empleado_sueldo: req.body.empleado_sueldo,
            empleado_sueldo_imss: req.body.empleado_sueldo_imss,
            empleado_cuenta_deposito: req.body.empleado_cuenta_deposito,
            empleado_cuenta_deposito_maquila: req.body.empleado_cuenta_deposito_maquila,
            empleado_periodo_id: req.body.empleado_periodo_id,
            empleado_diario: req.body.empleado_diario,
            empleado_rfc: req.body.empleado_rfc,
            empleado_curp: req.body.empleado_curp,
            empleado_empresa_id: req.body.empleado_empresa_id,
            empleado_sexo_id: req.body.empleado_sexo_id,
            empleado_estado_civil_id: req.body.empleado_estado_civil_id,
            empleado_fecha_alta: req.body.empleado_fecha_alta,
            empleado_ultima_modificacion: req.body.empleado_ultima_modificacion,
            empleado_usuario: req.body.empleado_usuario,
            empleado_password: req.body.empleado_password,
            empleado_estatus_baja: req.body.empleado_estatus_baja,
            empleado_fecha_baja: req.body.empleado_fecha_baja,
            empleado_actividad_tipo: req.body.empleado_actividad_tipo,
            empleado_perfil_app: req.body.empleado_perfil_app,
            sucursal_id: req.body.sucursal_id,
            tipo_indirecto_id: req.body.tipo_indirecto_id,
            empleado_contacto_emergencia_nombre: req.body.empleado_contacto_emergencia_nombre,
            empleado_contacto_emergencia_telefono: req.body.empleado_contacto_emergencia_telefono
        }, id]);

        return res.redirect('/dashboard/contabilidad/empleados/'+id);
    } catch (error) {
        console.log(error)
    }
}

export const dltEmployee = async (req, res) => {
    try {
        const { id } = req.params
        await pool.query('DELETE FROM empleados WHERE empleado_id = ?', [id])
        await pool.query('DELETE FROM USERS_FILES WHERE empleadoId = ?', [id])
        fs.unlinkSync('../../uploads/images/' + req.params.id)
        fs.unlinkSync('../../uploads/files/' + req.params.id)
        req.flash('success', {title: 'Empleado eliminado', message: 'El empleado se ha eliminado correctamente'})
        res.redirect('/dashboard/contabilidad/empleados/buscar')
    } catch (error) {
        console.log(error)
    }
}