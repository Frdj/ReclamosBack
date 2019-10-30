import { Request, Response } from 'express';
import { ResponseCode } from '../../dtos/response-codes.enum';
import  LoginService  from '../../services/login.service';

export class LoginController {

  login(req: Request, res: Response): boolean {
    const key = parseInt(req.params.tiendaKey);
    return LoginService.Login();
      // .then(r => res.json(r))
      // .catch(err => res.status(ResponseCode.UnAuthorized));
  }
}

export default new LoginController();