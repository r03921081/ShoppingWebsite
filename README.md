# shopProject
##	Framework  
*	Frontend: Bootstrap 4, javascript, html, css  
*	Backend:  Express 4, Nodejs, MySQL  

## 20181216 v.1
### Main functions:  
1. User signup, login and logout (Authentication)  
2. MySQL (Sequelize)  
3. Add Products CRUD  
4. Add Comments CRUD  
5. One-to-Many association implementation (User, Product)  

## 20181216 v.2
### Main functions: 
1. Authorization (User, Product, Comment)
2. connect-flash

## 20181227
### Main functions: 
1. Add Cart CRUD 
2. Add Order CRUD
3. Change Comments CRUD
4. Redesign SQL association implementation (User, Product, Comment, Cart, Order)
    1. One-to-One  
        * User, Cart
    2. One-to-Many  
        * User, Product  
        * User, Order
    3. Nested Many-to-One  
        * Comment, User, Product
    4. Many-to-Many  
        * Product, Cart  
        * Product, Order

## 20181229
### Main functions:  
1. Prevent CSRF attacks.  
    * csurf  
2. Store the session in MySQL.  
    * express-mysql-session  
3. Add email service (The gmail API is not yet registered.)  
    * nodemailer  
    1. Check user registration.
    2. Change the user password.
