const { Router } = require('express');
const { check } = require('express-validator');
const { fieldsValidation } = require('../middlewares/fields-validation');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();
const medicsController = require('../controllers/medics-controller');

// /api/medics
router.get('/', medicsController.getMedics);

router.post('/create', 
    [
        validateJWT,
        check('name', 'Medic name is required').not().isEmpty(),
        check('hospital', 'HospitalId must be valid').isMongoId(), // valida que el id enviado sea un mongoId 
        fieldsValidation
    ], 
    medicsController.createMedic
);

router.put('/update/:id', 
    [
        validateJWT,
        check('name', 'Medic name is required').not().isEmpty(),
        check('hospital', 'HospitalId must be valid').isMongoId(),
        fieldsValidation
    ],
    medicsController.updateMedic
);

router.delete('/delete/:id', validateJWT , medicsController.daleteMedic);

module.exports = router;