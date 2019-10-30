import express from 'express';
import loginController from './loginController';

var md_auth = require('../../../middleware/authenticate');

export default express.Router()
.get('login', md_auth.ensureAuth, loginController.login);
