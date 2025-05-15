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
const ReportsController = () => import('#controllers/reports_controller')

// Handle Chrome DevTools request
router.get('/.well-known/appspecific/com.chrome.devtools.json', ({ response }) => {
  return response.json({})
})

// Marketing pages
router.get('/', ({ inertia }) => inertia.render('landing/home/index'))
router.get('/about', ({ inertia }) => inertia.render('landing/about/index'))
router.get('/auth/login', ({ inertia }) => inertia.render('auth/login/index'))
router.get('/auth/create-account', ({ inertia }) => inertia.render('auth/create-account/index'))

router.get('/forgot-password', ({ inertia }) => inertia.render('auth/forgot-password'))
router.get('/reset-password', ({ inertia }) => inertia.render('auth/reset-password'))

// Dashboard pages
router
  .group(() => {
    router.get('/', ({ inertia }) => inertia.render('dashboard/home/index'))
    router.get('/customers', [CustomersController, 'getAll'])
    router.get('/customers/create', ({ inertia }) =>
      inertia.render('dashboard/customers/create/index'),
    )
    router.get('/jobs', ({ inertia }) => inertia.render('dashboard/jobs/index'))
    router.get('/jobs/create', ({ inertia }) => inertia.render('dashboard/jobs/create/index'))
    router.get('/invoices', ({ inertia }) => inertia.render('dashboard/invoices/index'))
    router.get('/invoices/create', ({ inertia }) =>
      inertia.render('dashboard/invoices/create/index'),
    )
    router.get('/payments', ({ inertia }) => inertia.render('dashboard/payments/index'))
    router.get('/payments/create', ({ inertia }) =>
      inertia.render('dashboard/payments/create/index'),
    )
    router.get('/finance', ({ inertia }) => inertia.render('dashboard/finance/index'))
    router.get('/settings', ({ inertia }) => inertia.render('dashboard/settings/index'))
  })
  .prefix('/dashboard')
  .middleware(middleware.auth())

// Unprotected API routes
router.post('/signup', [UsersController, 'create'])
router.post('/login', [UsersController, 'login'])
router.post('/forgot-password', [UsersController, 'forgotPassword'])
router.post('/reset-password', [UsersController, 'resetPassword'])
router.post('/logout', [UsersController, 'logout'])

// Protected API routes
router
  .group(() => {
    router
      .group(() => {
        router.put('/:id', [UsersController, 'update'])
        router.delete('/:id', [UsersController, 'delete'])
      })
      .prefix('/users')
    router
      .group(() => {
        router.post('/', [CustomersController, 'createCustomer'])
        router.get('/:id', [CustomersController, 'getCustomer'])
        router.put('/:id', [CustomersController, 'update'])
        router.delete('/:id', [CustomersController, 'delete'])
      })
      .prefix('/customers')

    router
      .group(() => {
        router.get('/dashboard', [JobsController, 'dashboard'])
        router.post('/', [JobsController, 'createJob'])
        router.get('/', [JobsController, 'getAll'])
        router.put('/:id', [JobsController, 'update'])
        router.delete('/:id', [JobsController, 'delete'])
      })
      .prefix('/jobs')

    router
      .group(() => {
        router.post('/', [PaymentsController, 'createPayment'])
        router.get('/', [PaymentsController, 'getAll'])
        router.put('/:id', [PaymentsController, 'updatePayment'])
        router.delete('/:id', [PaymentsController, 'delete'])
      })
      .prefix('/payments')

    router
      .group(() => {
        router.post('/', [InvoicesController, 'createInvoice'])
        router.get('/', [InvoicesController, 'getAll'])
        router.put('/:id', [InvoicesController, 'update'])
        router.delete('/:id', [InvoicesController, 'delete'])
      })
      .prefix('/invoices')

    router
      .group(() => {
        router.get('/customers', [ReportsController, 'cutsomersExport'])
        router.get('/jobs', [ReportsController, 'jobsExport'])
        router.get('/invoices', [ReportsController, 'invoicesExport'])
        router.get('/payments', [ReportsController, 'paymentsExport'])
      })
      .prefix('/reports')

    router.get('/health', [HealthChecksController])
  })
  .middleware(middleware.auth())

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// router.get('/docs', async () => {
//   return AutoSwagger.default.scalar('/swagger')
// })
