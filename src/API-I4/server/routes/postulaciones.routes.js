const express = require('express');
const {
  createPostulacion,
  getMisPostulaciones,
  patchPostulacion,
} = require('../controllers/postulaciones.controller.js');

const router = express.Router();

router.patch('/postulaciones/:id', patchPostulacion);
router.post('/postulaciones', createPostulacion);
router.get('/mis_postulaciones', getMisPostulaciones);

module.exports = router;
