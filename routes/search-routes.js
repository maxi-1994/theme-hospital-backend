const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
const searchController = require('../controllers/search-controller');

// '/api/all'
router.get('/:search', validateJWT, searchController.getAll);
router.get('/colection/:table/:search', validateJWT, searchController.getColectionDocuments);

module.exports = router;


