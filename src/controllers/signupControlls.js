import bcrypt from 'bcrypt';
import { STATUS_CODE } from '../enums/statusCode.js';
import { signUpSchema } from '../schemas/validationSchemas.js';
import { createUser, checkEmail } from '../repository/authRepository.js';

async function signupPost (req, res) {
    const { email, password, username, pictureUrl } = req.body;

    try {
        const isValid = signUpSchema.validate({
            email, password, username, pictureUrl
        });

        if(isValid.error) {
            const errors = isValid.error.details.map(detail => detail.message);

            return res.status(STATUS_CODE.ERRORUNPROCESSABLEENTITY).send({"message": errors});
        }

        const emailExist = await checkEmail(email);

        if((emailExist.rows).length) {
            res.status(STATUS_CODE.ERRORCONFLICT).send({
                "message": "Preencha os dados corretamente!"
            });
            return;
        }

        const excrypetPassword = await bcrypt.hash(password, 12);

        await createUser(email, excrypetPassword, username, pictureUrl);

        return res.sendStatus(STATUS_CODE.SUCCESSCREATED);
    } catch (error) {
        res.status(STATUS_CODE.SERVERERRORINTERNAL).send(error.message);
        return;
    }
}

export { signupPost }