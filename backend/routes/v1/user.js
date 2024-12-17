const express = require('express');

const userController = require('../../controllers/user');
const router = express.Router();

// Route: GET /profile
router.get('/', userController.list);
router.get('/profile', userController.getProfile);
router.patch('/', userController.update);
// Route: DELETE /profile/:id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  res.send(`Profile with ID ${id} deleted`);
});

module.exports = router;
