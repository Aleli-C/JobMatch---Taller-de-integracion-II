const pool = require('../db'); // mysql2/promise

const ESTADOS = new Set(['aceptada', 'rechazada']);

const patchPostulacion = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'id inválido' });

    const { estado_postulacion } = req.body || {};
    const nuevoEstado = String(estado_postulacion || '').trim();

    if (!ESTADOS.has(nuevoEstado)) {
      return res.status(400).json({ error: "estado_postulacion debe ser 'aceptada' o 'rechazada'" });
    }

    // Existe?
    const [[row]] = await pool.query(
      'SELECT id_postulacion, estado_postulacion FROM `Postulaciones` WHERE id_postulacion = ? LIMIT 1',
      [id]
    );
    if (!row) return res.status(404).json({ error: 'Postulación no encontrada' });

    // Actualizar
    await pool.query(
      `UPDATE \`Postulaciones\`
          SET \`estado_postulacion\` = ?, \`fecha\` = CURRENT_TIMESTAMP(3)
        WHERE \`id_postulacion\` = ?`,
      [nuevoEstado, id]
    );

    const [[updated]] = await pool.query(
      'SELECT * FROM `Postulaciones` WHERE id_postulacion = ? LIMIT 1',
      [id]
    );

    return res.json(updated);
  } catch (err) {
    console.error('patchPostulacion error:', err);
    return res.status(500).json({ error: 'Error al actualizar postulación' });
      }
};

const t = (s) => (typeof s === 'string' ? s.trim() : s);


const createPostulacion = async (req, res) => {
  try {
    const { id_publicacion, id_postulante, mensaje, estado_postulacion } = req.body || {};

    if (!id_publicacion || !id_postulante) {
      return res.status(400).json({ error: 'id_publicacion e id_postulante son obligatorios' });
    }

    // (Opcional mínimo) verificar existencia para dar error amigable
    const [[pub]] = await pool.query(
      'SELECT id_publicacion FROM `Publicaciones` WHERE id_publicacion = ? LIMIT 1',
      [Number(id_publicacion)]
    );
    if (!pub) return res.status(404).json({ error: 'Publicación no encontrada' });

    const [[usr]] = await pool.query(
      'SELECT id_usuario FROM `Usuarios` WHERE id_usuario = ? LIMIT 1',
      [Number(id_postulante)]
    );
    if (!usr) return res.status(404).json({ error: 'Usuario (postulante) no encontrado' });

    // construir INSERT con columnas presentes
    const cols = ['id_publicacion', 'id_postulante'];
    const vals = [Number(id_publicacion), Number(id_postulante)];

    if (mensaje !== undefined) { cols.push('mensaje'); vals.push(t(mensaje)); }
    if (estado_postulacion !== undefined) { cols.push('estado_postulacion'); vals.push(t(estado_postulacion)); }

    const placeholders = cols.map(() => '?').join(',');
    const sql = `INSERT INTO \`Postulaciones\` (${cols.map(c => '`'+c+'`').join(',')}) VALUES (${placeholders})`;
    const [result] = await pool.query(sql, vals);

    const [[row]] = await pool.query(
      'SELECT * FROM `Postulaciones` WHERE id_postulacion = ? LIMIT 1',
      [result.insertId]
    );

    return res.status(201).json(row);
  } catch (err) {
    // Duplicado por UNIQUE(id_publicacion, id_postulante)
    if (err && err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Ya existe una postulación para este usuario y publicación' });
    }
    console.error('createPostulacion error:', err);
    return res.status(500).json({ error: 'Error al crear postulación' });
  }
};

const getMisPostulaciones = async (req, res) => {
  try {
    const userIdHeader = req.header('x-user-id');
    const userIdQuery = req.query.userId;
    const userId = Number(userIdHeader || userIdQuery);

    if (!userId) {
      return res.status(400).json({ error: 'Falta userId (header x-user-id o query userId)' });
    }

    const limit = Math.max(1, Math.min(100, Number(req.query.limit || 20)));
    const offset = Math.max(0, Number(req.query.offset || 0));

    const sql = `
      SELECT
        po.*,
        p.titulo AS publicacion_titulo,
        p.estado AS publicacion_estado,
        p.ciudad AS publicacion_ciudad,
        p.region AS publicacion_region
      FROM \`Postulaciones\` po
      JOIN \`Publicaciones\` p ON p.id_publicacion = po.id_publicacion
      WHERE po.id_postulante = ?
      ORDER BY po.fecha DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [userId, limit, offset]);

    return res.json({ items: rows, limit, offset, userId });
  } catch (err) {
    console.error('getMisPostulaciones error:', err);
    return res.status(500).json({ error: 'Error al listar mis postulaciones' });
  }
};

module.exports = {
  patchPostulacion,
  createPostulacion,
  getMisPostulaciones,
};
