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

// Marketing pages
router.get('/', ({ inertia }) => inertia.render('landing/home/index'))
router.get('/about', ({ inertia }) => inertia.render('landing/about/index'))
router.get('/auth/login', ({ inertia }) => inertia.render('auth/login/index'))
router.get('/auth/create-account', ({ inertia }) => inertia.render('auth/create-account/index'))

// Dashboard pages
router
  .group(() => {
    router.get('/', ({ inertia }) => inertia.render('dashboard/home/index'))
    router.get('/customers', ({ inertia }) => inertia.render('dashboard/customers/index'))
    router.get('/customers/create', ({ inertia }) => inertia.render('dashboard/customers/create/index'))
    router.get('/jobs', ({ inertia }) => inertia.render('dashboard/jobs/index'))
    router.get('/jobs/create', ({ inertia }) => inertia.render('dashboard/jobs/create/index'))
    router.get('/invoices', ({ inertia }) => inertia.render('dashboard/invoices/index'))
    router.get('/invoices/create', ({ inertia }) => inertia.render('dashboard/invoices/create/index'))
    router.get('/payments', ({ inertia }) => inertia.render('dashboard/payments/index'))
    router.get('/payments/create', ({ inertia }) => inertia.render('dashboard/payments/create/index'))
    router.get('/finance', ({ inertia }) => inertia.render('dashboard/finance/index'))
    router.get('/settings', ({ inertia }) => inertia.render('dashboard/settings/index'))
  })
  .prefix('/dashboard')
  .middleware(middleware.auth())

// Unprotected API routes
router.post('/api/v1/users', [UsersController, 'create'])
router.post('/api/v1/users/login', [UsersController, 'apiLogin'])

// Protected API routes
router
  .group(() => {
    router
      .group(() => {
        router.get('/me', [UsersController, 'me'])
        router.put('/:id', [UsersController, 'update'])
        router.delete('/:id', [UsersController, 'delete'])
      })
      .prefix('users')
    router
      .group(() => {
        router.get('/all', [CustomersController, 'getAll'])
        router.get('/stats', [CustomersController, 'stats'])
        router.post('/', [CustomersController, 'createCustomer'])
        router.get('/:id', [CustomersController, 'getCustomer'])
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
  .prefix('/api/v1')
  .middleware(middleware.auth())

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// router.get('/docs', async () => {
//   return AutoSwagger.default.scalar('/swagger')
// })
