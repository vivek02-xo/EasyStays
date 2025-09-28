#  EasyStays  

EasyStays is a **property rental and booking web app** inspired by Airbnb.  
Users can explore listings, create their own, and manage stays with a simple, intuitive interface.  

---

##  Features  
-  User authentication (sign up / log in / log out)  
-  Create, edit, and delete property listings  
-  Upload property images  
-  Localized currency display (₹, $, € etc.)  
-  Responsive design for desktop & mobile  

---

##  Tech Stack  
- **Frontend**: HTML, CSS, EJS  
- **Backend**: Node.js, Express  
- **Database**: MongoDB with Mongoose  
- **Others**: Method-Override, REST APIs  

---

##  Getting Started  

### 1. Clone the repository  
```bash
git clone https://github.com/your-username/EasyStays.git
cd EasyStays
````

### 2. Install dependencies

```bash
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running locally (default: `mongodb://127.0.0.1:27017/wanderlust`).

### 4. Run the app

```bash
node app.js
```

Now visit  **[http://localhost:8080](http://localhost:8080)** in your browser 🎉

---

##  Project Structure

```
EasyStays/
│── models/        # Database models
│── routes/        # Express routes
│── views/         # EJS templates
│── public/        # CSS, JS, assets
│── app.js         # Main server file
│── package.json
│── README.md
```

---

##  Roadmap

*  Add reviews & ratings
*  Implement booking calendar
*  Payment integration (Stripe/PayPal)
*  Advanced search filters

---

##  Contributing

Contributions are welcome!
For major updates, open an issue first to discuss what you’d like to change.
