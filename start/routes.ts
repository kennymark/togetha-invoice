/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import swagger from '#config/swagger'
import router from '@adonisjs/core/services/router'
import AutoSwagger from 'adonis-autoswagger'
import { middleware } from './kernel.js'
const HealthChecksController = () => import('#controllers/health_checks_controller')
const CustomersController = () => import('#controllers/customers_controller')
const JobsController = () => import('#controllers/jobs_controller')
const PaymentsController = () => import('#controllers/payments_controller')
const InvoicesController = () => import('#controllers/invoices_controller')
const UsersController = () => import('#controllers/users_controller')
router.on('/').renderInertia('home')

router
  .group(() => {
    router
      .group(() => {
        router.post('/', [UsersController, 'create'])
        router.post('/login', [UsersController, 'apiLogin'])
        router.get('/me', [UsersController, 'me'])
        router.put('/:id', [UsersController, 'update'])
        router.delete('/:id', [UsersController, 'delete'])
      })
      .prefix('users')
    router
      .group(() => {
        router.get('/all', [CustomersController, 'getAll'])
        router.get('/dashboard', [CustomersController, 'dashboard'])
        router.post('/', [CustomersController, 'createCustomer'])
        router.put('/:id', [CustomersController, 'update'])
        router.delete('/:id', [CustomersController, 'delete'])
      })
      .prefix('customers')

    router
      .group(() => {
        router.get('/dashboard', [JobsController, 'dashboard'])
        router.post('/', [JobsController, 'createJob'])
        router.get('/', [JobsController, 'getAll'])
        router.put('/:id', [JobsController, 'update'])
        router.delete('/:id', [JobsController, 'delete'])
      })
      .prefix('jobs')

    router
      .group(() => {
        router.post('/', [PaymentsController, 'createPayment'])
        router.get('/', [PaymentsController, 'getAll'])
        router.put('/:id', [PaymentsController, 'updatePayment'])
        router.delete('/:id', [PaymentsController, 'delete'])
      })
      .prefix('payments')

    router
      .group(() => {
        router.post('/', [InvoicesController, 'createInvoice'])
        router.get('/', [InvoicesController, 'getAll'])
        router.put('/:id', [InvoicesController, 'update'])
        router.delete('/:id', [InvoicesController, 'delete'])
      })
      .prefix('invoices')
    router.get('/health', [HealthChecksController])
  })
  .prefix('api/v1')
  .middleware(middleware.auth())

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

router.get('/docs', async () => {
  return AutoSwagger.default.scalar('/swagger')
})
