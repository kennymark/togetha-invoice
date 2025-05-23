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
const DevEmailsController = () => import('#controllers/dev_emails_controller')

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

router.get('/errors/not-found', ({ inertia }) => inertia.render('errors/not-found/index'))

// Dashboard pages
router
  .group(() => {
    router.get('/', [UsersController, 'dashboard'])

    router.get('/customers', [CustomersController, 'renderCustomersPage'])
    router.get('/customers/create', ({ inertia }) =>
      inertia.render('dashboard/customers/create/index'),
    )
    router.get('/customers/:customerId', [CustomersController, 'renderCustomerDetailsPage'])
    router.get('/customers/:customerId/edit', [CustomersController, 'renderEditCustomerPage'])

    router.get('/jobs', [JobsController, 'renderJobsPage'])
    router.get('/jobs/create', [JobsController, 'renderCreateJobPage'])
    router.get('/jobs/:jobId/edit', [JobsController, 'renderEditJobPage'])
    router.get('/jobs/:jobId', [JobsController, 'renderJobDetailsPage'])

    router.get('/invoices', [InvoicesController, 'renderInvoicesPage'])
    router.get('/invoices/create', [InvoicesController, 'renderCreateInvoicePage'])
    router.get('/invoices/:invoiceId/edit', [InvoicesController, 'renderEditInvoicePage'])
    router.get('/invoices/:invoiceId', [InvoicesController, 'renderInvoiceDetailsPage'])
    router.get('/invoices/:invoiceId/pay', [InvoicesController, 'renderInvoicePaymentPage'])

    router.get('/payments', ({ inertia }) => inertia.render('dashboard/payments/index'))
    router.get('/payments/create', ({ inertia }) =>
      inertia.render('dashboard/payments/create/index'),
    )

    router.get('/finance', ({ inertia }) => inertia.render('dashboard/finance/index'))

    router.get('/settings', [UsersController, 'settings'])
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
        router.delete('/:id', [UsersController, 'delete'])
        router.put('/settings', [UsersController, 'updateAccountSettings'])
        router.put('/password', [UsersController, 'updatePassword'])
      })
      .prefix('/users')
    router
      .group(() => {
        router.post('/', [CustomersController, 'create'])
        router.put('/:id', [CustomersController, 'update'])
        router.delete('/:id', [CustomersController, 'delete'])
      })
      .prefix('/customers')

    router
      .group(() => {
        router.post('/', [JobsController, 'create'])
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
        router.post('/', [InvoicesController, 'create'])
        router.put('/:id', [InvoicesController, 'update'])
        router.delete('/:id', [InvoicesController, 'delete'])
        router.put('/:id/mark-as-paid-or-unpaid', [InvoicesController, 'markAsPaidOrUnpaid'])
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
    router.get('/dev-emails', [DevEmailsController, 'index'])
  })
  .middleware(middleware.auth())

router.get('/swagger', async () => {
  return AutoSwagger.default.docs(router.toJSON(), swagger)
})

// router.get('/docs', async () => {
//   return AutoSwagger.default.scalar('/swagger')
// })
