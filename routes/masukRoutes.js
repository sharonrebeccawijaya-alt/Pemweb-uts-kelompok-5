
const express = require('express');
const router = express.Router();

const masukController = require('../controllers/masukController');

// READ
router.get('/', masukController.index);

// CREATE
router.get('/tambah', masukController.createForm);
router.post('/tambah', masukController.store);

// UPDATE
router.get('/:id/edit', masukController.editForm);
router.post('/:id/edit', masukController.update);

// DELETE
router.post('/:id/delete', masukController.destroy);

module.exports = router;
