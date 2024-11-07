const router = require('express').Router();
const controller = require('../controllers/user');

router.get('/', controller.listUsers);

router.get('/:id', controller.getUser);

router.patch('/:id', controller.updateUser);

router.post('/new', controller.createUser);

router.delete('/:id', controller.deleteUser);

module.exports = router;
