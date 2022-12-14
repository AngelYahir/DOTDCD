import {pool} from '../../db.js'
import {SW_SAPIENS_URL, SW_TOKEN} from '../../config.js'
import axios from 'axios'
import { polygonLength } from 'd3'

const getClientInfo = async (id) => {
    try {
        const client = await pool.query('SELECT * FROM clientes WHERE cliente_id = ?', [id])
        return client[0][0]
    } catch (error) {
        console.log(error)
    }
}

const uploaToDB = async (data) => {
    try {
        await pool.query('INSERT INTO facturas SET ?', [data])
    } catch (error) {
        console.log(error)
    }
}

export const addFactura = async (req, res) => {
    try {
        const test = false
 
        const employee = req.body.info.id_empleado

        if(req.body.remisionfactura_id == 1){


            const client = await getClientInfo(req.body.cliente_id)


            const data = {
                Version: "4.0",
                FormaPago: req.body.forma_pago,
                Serie: "SW",
                Folio: req.body.folio,
                Fecha: req.body.factura_fecha_alta,
                MetodoPago: req.body.mpago,
                Sello: "",
                NoCertificado: "",
                Certificado: "",
                CondicionesDePago: "CondicionesDePago",
                SubTotal: req.body.factura_total,
                Descuento: req.body.descuento,
                Moneda: (req.body.factura_moneda_id == 1) ? "MXN" : "USD",
                TipoCambio: req.body.tipo_cambio,
                Total: req.body.factura_total,
                TipoDeComprobante: "I",
                Exportacion: "01",
                LugarExpedicion: "45610",
                Emisor: {
                    Rfc: (test == true) ? "EKU9003173C9" : client.cliente_rfc,
                    Nombre: (test == true) ? "ESCUELA KEMPER URGATE" : client.cliente_razon_social,
                    RegimenFiscal: "601"
                },
                Receptor: {
                    Rfc: "EKU9003173C9",
                    Nombre: "ESCUELA KEMPER URGATE",
                    DomicilioFiscalReceptor: "26015",
                    RegimenFiscalReceptor: "601",
                    UsoCFDI: (req.body.uso_cfdi == 4) ? "CP01" : "G01"
                },
                Conceptos: [
                    {
                        ClaveProdServ: req.body.clave,
                        NoIdentificacion: "None",
                        Cantidad: req.body.cantidad,
                        ClaveUnidad: req.body.cUnidad,
                        Unidad: req.body.unidad,
                        Descripcion: req.body.factura_descripcion,
                        ValorUnitario: req.body.vUnitario,
                        Importe: req.body.importe,
                        Descuento: req.body.descuento,
                        ObjetoImp: "04",
                    }
                ],
            }
    
            await axios.post(`${SW_SAPIENS_URL}/v3/cfdi33/issue/json/v4`, data, {
                headers: {
                    'Content-Type': 'application/jsontoxml;',
                    'Authorization': 'Bearer T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbXB3YVZxTHdOdHAwVXY2NTdJb1hkREtXTzE3dk9pMmdMdkFDR2xFWFVPUXpTUm9mTG1ySXdZbFNja3FRa0RlYURqbzdzdlI2UUx1WGJiKzViUWY2dnZGbFloUDJ6RjhFTGF4M1BySnJ4cHF0YjUvbmRyWWpjTkVLN3ppd3RxL0dJPQ.T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbFlVcU92YUJTZWlHU3pER1kySnlXRTF4alNUS0ZWcUlVS0NhelhqaXdnWTRncklVSWVvZlFZMWNyUjVxYUFxMWFxcStUL1IzdGpHRTJqdS9Zakw2UGRCNXoxZ3J4SFBqMHg3VWR1UEVYajlpZUxwbjhmY0I2UXN3b1lRV3M4UnJteitUcCtEZTYvZXNrZ25zcUo1MUl0VzR4RzcyTTNIWERmbnhGYTBUYTdEMFpQSko1bS9VOHVXY3Y2MlZFcmZydUgxOC9HQ1ZHb1lCdExNK3pKUHI2dEtHOUE3UnQzaGI4UVJXRTVLWWIvbjJ6QlFpMTlLbmtpdi96c3VRZ3VjQlViN01sZitkVzVuSFE3OWQ1VWM4emxVSXBuNXpvWjFqNFN1SmQ5bTNQdUZ0dGJGOStpQkFIT1dHRDJoR1ZucXhlLzZXZWhweHRoN0xYUTltR2QyK1lFbjVsVmZyVUZKSXpYTHZ1Y2J6SzZxUXpGK0owYnJsS0VHd1dWcTFuT1hyUm1hNXhPQ1dBZ29NS2tGWWRReWl2aC9oWTMxYVZKbTV4bFhBS3NGNGdKWVMzaVdaNUo5R25DQ240aml5bDJhWjhyR0prOFlmaDZKZzFwSmhXOFJkQ1k.aoSIitFZCOpUTtBZxpZR4XrCCriT8SJhO2wRIpq4kD8'
                }
            })
            .then(async (response) => {
                if (response.status == 200) {
                    const data = {
                      factura_empresa_id: req.body.factura_empresa_id,
                      factura_cliente_id: req.body.factura_cliente_id,
                      factura_descripcion: req.body.factura_descripcion,
                      factura_empleado_id: employee,
                      factura_centrodecostos_id: req.body.factura_centrodecostos_id,
                      factura_proyecto_id: req.body.factura_proyecto_id,
                      factura_folio_id: req.body.factura_folio_id,
                      factura_remisionfactura_id: req.body.factura_remisionfactura_id,
                      factura_moneda_id: req.body.factura_moneda_id,
                      factura_subtotal: req.body.factura_subtotal,
                      factura_iva: req.body.factura_iva,
                      factura_total: req.body.factura_total,
                      factura_fecha_alta: req.body.factura_fecha_alta,
                      factura_observaciones: req.body.factura_observaciones,
                      retencion: req.body.retencion,
                      retencion_isr: req.body.retencion_isr,
                      tipo_venta: req.body.tipo_venta,
                      tipo_cambio: req.body.tipo_cambio,
                      factura_anticipo_id: req.body.factura_anticipo_id,
                      factura_inversion_id: req.body.factura_inversion_id,
                      correo: req.body.correo,
                      uso_cfdi: req.body.uso_cfdi,
                      uuid: response.data.data.uuid,
                      cadena_sat: response.data.data.cadenaOriginalSAT,
                      sello_sat: response.data.data.selloSAT,
                      sello_cfdi: response.data.data.selloCFDI,
                      qr: response.data.data.qrCode,
                    }
                    await uploaToDB(data)
                    req.flash('success', {message: 'Factura timbrada correctamente', title: 'Factura Timbrada'})
                    return res.redirect('/dashboard/administracion/facturas')
                } else {
                    req.flash('error', {message: 'Error al timbrar la factura', title: 'Error'})
                    return res.redirect('/dashboard/administracion/facturas/nuevo')
                }
            })
            .catch((error) => {
                console.log(error)
                req.flash('error', {message: 'Error al timbrar la factura', title: 'Error'})
                return res.redirect('/dashboard/administracion/facturas/nuevo')
            })
        } else { //! <--- Else de la validacion de la factura
            const data = {
                factura_empresa_id: req.body.factura_empresa_id,
                factura_cliente_id: req.body.factura_cliente_id,
                factura_descripcion: req.body.factura_descripcion,
                factura_empleado_id: employee,
                factura_centrodecostos_id: req.body.factura_centrodecostos_id,
                factura_proyecto_id: req.body.factura_proyecto_id,
                factura_folio_id: req.body.factura_folio_id,
                factura_remisionfactura_id: req.body.factura_remisionfactura_id,
                factura_moneda_id: req.body.factura_moneda_id,
                factura_subtotal: req.body.factura_subtotal,
                factura_iva: req.body.factura_iva,
                factura_total: req.body.factura_total,
                factura_fecha_alta: req.body.factura_fecha_alta,
                factura_observaciones: req.body.factura_observaciones,
                retencion: req.body.retencion,
                retencion_isr: req.body.retencion_isr,
                tipo_venta: req.body.tipo_venta,
                tipo_cambio: req.body.tipo_cambio,
                factura_anticipo_id: req.body.factura_anticipo_id,
                factura_inversion_id: req.body.factura_inversion_id,
                correo: req.body.correo,
                uso_cfdi: req.body.uso_cfdi
            }

            await uploaToDB(data)
            req.flash('success', {message: 'Factura timbrada correctamente', title: 'Factura Timbrada'})
            return res.redirect('/dashboard/administracion/facturas')
        }


    } catch (error) {
        console.log(error)
        req.flash('error', {message: 'Error al timbrar la factura', title: 'Error'})
        return res.redirect('/dashboard/administracion/facturas/nuevo')
    }
}

export const cancelFactura = async (req, res) => {
    try {
        const {id} = req.params
        const factura = await pool.query('SELECT * FROM facturas WHERE factura_id = ?', [id])

        if (factura.length > 0) {
            const uuid = factura[0].uuid
            await axios.post(`${SW_SAPIENS_URL}/cfdi33/cancel/EKU9003173C9/${uuid}/${req.body.motivo}/`, {
                headers: {
                    'Content-Type': 'application/jsontoxml;',
                    'Authorization': 'Bearer T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbXB3YVZxTHdOdHAwVXY2NTdJb1hkREtXTzE3dk9pMmdMdkFDR2xFWFVPUXpTUm9mTG1ySXdZbFNja3FRa0RlYURqbzdzdlI2UUx1WGJiKzViUWY2dnZGbFloUDJ6RjhFTGF4M1BySnJ4cHF0YjUvbmRyWWpjTkVLN3ppd3RxL0dJPQ.T2lYQ0t4L0RHVkR4dHZ5Nkk1VHNEakZ3Y0J4Nk9GODZuRyt4cE1wVm5tbFlVcU92YUJTZWlHU3pER1kySnlXRTF4alNUS0ZWcUlVS0NhelhqaXdnWTRncklVSWVvZlFZMWNyUjVxYUFxMWFxcStUL1IzdGpHRTJqdS9Zakw2UGRCNXoxZ3J4SFBqMHg3VWR1UEVYajlpZUxwbjhmY0I2UXN3b1lRV3M4UnJteitUcCtEZTYvZXNrZ25zcUo1MUl0VzR4RzcyTTNIWERmbnhGYTBUYTdEMFpQSko1bS9VOHVXY3Y2MlZFcmZydUgxOC9HQ1ZHb1lCdExNK3pKUHI2dEtHOUE3UnQzaGI4UVJXRTVLWWIvbjJ6QlFpMTlLbmtpdi96c3VRZ3VjQlViN01sZitkVzVuSFE3OWQ1VWM4emxVSXBuNXpvWjFqNFN1SmQ5bTNQdUZ0dGJGOStpQkFIT1dHRDJoR1ZucXhlLzZXZWhweHRoN0xYUTltR2QyK1lFbjVsVmZyVUZKSXpYTHZ1Y2J6SzZxUXpGK0owYnJsS0VHd1dWcTFuT1hyUm1hNXhPQ1dBZ29NS2tGWWRReWl2aC9oWTMxYVZKbTV4bFhBS3NGNGdKWVMzaVdaNUo5R25DQ240aml5bDJhWjhyR0prOFlmaDZKZzFwSmhXOFJkQ1k.aoSIitFZCOpUTtBZxpZR4XrCCriT8SJhO2wRIpq4kD8'
                }
            })
            .then(async (response) => {
                if (response.data.status === 'success') {
                    await pool.query('UPDATE facturas SET factura_estatus_baja = ? WHERE factura_id = ?', ['1', id])
                    return res.status(200).json({message: 'Factura cancelada correctamente', status: 200})
                } else {
                    return res.status(404).json({message: 'Factura no encontrada', status: 404})
                }
            })
            .catch((error) => {
                console.log(error)
                return res.status(404).json({message: 'Factura no encontrada', status: 404})
            })
        } else {
            return res.status(404).json({message: 'Factura no encontrada', status: 404})
        }
    } catch (error) {
        console.log(error)
    }
}