Owomi endpoints

Users Module
Dashboard

- totalEarnings
- Unpaid Invoices
- Active jobs
- Recent activity :-> sort, filters

Invoices

- totalInvoiceSent
- overDueIncoices
- All invoices with pagination
  - Customer, created, totalAmount, dueDate, status
- Create invoice:
  - Select customer
  - Invoice, invoice title, receive payment in[usd, gbp, eur], dueDate
  - isRecurringInvoice, startDate, endDate, frequency
  - offeringDiscount, select DiscountType, input Value
  - Additional notes
  - Service&items
    - itemName
    - Quantity
    - unitPrice
    - itemTotal
    - itemSubtotal
    - Discount

Payments
Homepage:
link, service title, amount, createdOn, status
_ Create payment link
_ Title. Description , payment currency, amoun

Jobs
homepage: completed, active, activity
_ activity: job, customer details, assigned, priority, status , due date
_ Create job
_ Title, customer, category, due date, status, priority, description
_ Images

Customers
Homepage
_ total customers, activity(name, email, phoneNUmber),
_ add customer: \* fullname, email, phone number, bussiness name(optional), address line, post cod
city, country
