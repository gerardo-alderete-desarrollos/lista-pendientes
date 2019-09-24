var express = require('express');
var app = express();
var Lista = require('../models/lista');

// ==========================================
// Crear un nueva lista de pendiente
// ==========================================
app.post('/', (req, res) => {

    var body = req.body;

    var lista = new Lista({
        nombre: body.nombre,
        isTerminado: body.isTerminado,
        fechaCreacion: new Date(),
        fechaTermino: body.fechaTermino
    });

    lista.save((err, ListaGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear lista de pendiente',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            lista: ListaGuardada,
            mensaje: `Lista creada ${ListaGuardada.nombre} correctamente`
        });
    });
});
// ==========================================
// Obtener lista
// ==========================================
app.get('/', (req, res) => {
    var pendientes = req.query.pendientes;
    pendientes = pendientes === 'false' ? false : true;
    sPendientes = pendientes ? 'pendientes' : 'completados';
    Lista.find({ isTerminado: !pendientes })
        .exec(
            (err, lista) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: `Error cargando lista de ${sPendientes}`,
                        errors: err
                    });
                }

                Lista.count({ isTerminado: !pendientes }, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        message: `Lista de ${sPendientes}`,
                        lista: lista,
                        pendientes: !pendientes ? null : conteo - !pendientes,
                        completados: pendientes ? null : conteo
                    });
                })
            });
});
// ==========================================
// Actualizar lista de pendiente
// ==========================================
app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Lista.findById(id, (error, lista) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Erro al buscar lista de pendiente',
                errors: error
            });
        }
        if (!lista) {
            return res.status(400).json({
                ok: false,
                mensaje: `La lista con el id ${id} no existe`,
                errors: error
            })
        }

        console.log(body);
        lista.nombre = body.nombre;
        lista.isTerminado = body.isTerminado;
        lista.fechaCreacion = lista.fechaCreacion;
        lista.fechaTermino = body.isTerminado ? new Date() : null;

        var msg = body.nombre ? 'El nombre ha sido cambiado.. ' : '';
        msg += body.isTerminado ? 'La lista ha sido completada' : '';


        lista.save((error, listaGuardada) => {
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al Actualizar la lista de pendiente',
                    errors: error
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: msg,
                lista: listaGuardada
            })
        })

    })
})


// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id', (req, res) => {

    var id = req.params.id;

    Lista.findByIdAndRemove(id, (err, listaBorrada) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar lista',
                errors: err
            });
        }

        if (!listaBorrada) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe una lista con ese id',
                errors: { message: 'No existe una lista con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            lista: listaBorrada,
            mensaje: `Lista ${listaBorrada.nombre} borrada`
        });

    });

});

module.exports = app;