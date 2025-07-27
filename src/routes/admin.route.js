import controller from '../controller/admin.controller.js'
import { Routes } from 'express'
import { RolesGuard } from '../guards/role.guard.js'
import { AuthGuard } from '../guards/auth.guard.js'
import Adminvalidate from '../validation/admin.validate.js'
import { validate } from '../middlewares/validate.js'

const routes = Routes()

routes
    .post('/', AuthGuard, RolesGuard('SUPERADMIN'), validate(Adminvalidate.create), controller.createAdmin)
    .post('/signin', validate(Adminvalidate.signIn), controller.signInAdmin)
    .post('/newtoken', controller.newToken)
    .post('/logout', AuthGuard, controller.signOut)
    .get('/', AuthGuard, RolesGuard('SUPERADMIN'), controller.getAll)
    .get('/:id', AuthGuard, RolesGuard('SUPERADMIN', 'ID'), controller.getByID)
    .patch('/:id', AuthGuard, RolesGuard('SUPERADMIN', 'ID'), validate(Adminvalidate.update), controller.update)
    .delete('/:id', RolesGuard('SUPERADMIN'), AuthGuard, controller.delete)

export default routes