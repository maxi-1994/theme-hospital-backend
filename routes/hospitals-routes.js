const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidation } = require('../middlewares/fields-validation');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
const hospitalsController = require('../controllers/hospitals-controller');

// /api/hospitals
router.get('/', hospitalsController.getHospitals);

router.post('/create', 
    [
        validateJWT,
        check('name', 'Hospital name is required').not().isEmpty(),
        fieldsValidation
    ], 
    hospitalsController.createHospital
);

router.put('/update/:id', 
    [
        validateJWT,
        check('name', 'Hospital name is required').not().isEmpty(),
        fieldsValidation
    ],
    hospitalsController.updateHospital
);

router.delete('/delete/:id', validateJWT, hospitalsController.daleteHospital);

module.exports = router;