# 2800-202210-BBY24

1. Project Title: AtmosPal
2. Project Description: BBY-24 is developing AtmosPal, a mobile-first and interactive weather application that helps people with limited awareness to plan and prepare for various weather-induced events, through providing information, alerts, protocols, and safety products.

3. Technologies used 
Frontend: HTML, EJS, Bootstrap, CSS, JavaScript, and JQuery
            Backend: Node.js, Javascript, Socket.io, MongoDB, Openweather API, mongoose, Heroku
            Database: MongoDB

4. Listing of File Contents of folder 

│  .env                                                           
│  .gitignore                                                          
│  app.js                                                          
│  index.css                                                          
│  package-lock.json                                                          
│  package.json                                                          
│  Procfile                                                          
│                                                          
├─models                                                          
│      category.js                                                          
│      page.js                                                          
│      Posting.js                                                          
│      product.js                                                          
│      user.js                                                          
│                                                          
├─public                                                          
│  ├─css                                                          
│  │  │  addUser.css                                                          
│  │  │  adminStyle.css                                                          
│  │  │  allUsers.css                                                          
│  │  │  atmosChat.css                                                          
│  │  │  dashboard.css                                                          
│  │  │  easterEgg.css                                                          
│  │  │  editUser.css                                                          
│  │  │  home.css                                                          
│  │  │  index.css                                                          
│  │  │  new.css                                                          
│  │  │  protocols.css                                                          
│  │  │  show.css                                                          
│  │  │  style.css                                                          
│  │  │  weather.css                                                          
│  │  │                                                          
│  │  └─img                                                          
│  │          avatar.png                                                          
│  │          bar.png                                                          
│  │          bcit_background.jpg                                                          
│  │          cityHall.jpg                                                          
│  │          dummy.png                                                          
│  │          extreme_weather.jpg                                                          
│  │          facebook.jpg                                                          
│  │          highWind.jpg                                                          
│  │          img1.jpg                                                          
│  │          instagram.jpg                                                          
│  │          lightining.png                                                          
│  │          location.png                                                          
│  │          logo.png                                                          
│  │          newBrunswick.jpg                                                          
│  │          profile.png                                                          
│  │          rain.png                                                          
│  │          scienceWorld.jpg                                                          
│  │          toronto.jpg                                                          
│  │          twitter.jpg                                                          
│  │          youtube.jpg                                                          
│  │                                                          
│  ├─images                                                          
│  │      noImage.png                                                          
│  │                                                          
│  ├─js                                                          
│  │      admin_weather.js                                                          
│  │      easterEgg.js                                                          
│  │      format.js                                                          
│  │      main.js                                                          
│  │      weather.js                                                          
│  │                                                          
│  └─productImages                                                          
│      │  batteries.png                                                          
│      │  blanket.png                                                          
│      │                                                          
│      ├─routers                                                          
│      adminCategories.js                                                          
│      adminPages.js                                                          
│      adminProducts.js                                                          
│      dashboardRouter.js                                                          
│      pages.js                                                          
│                                                          
├─uploads                                                          
│      image-1652810152414.png                                                          
│                                                          
├─utils                                                          
│      messages.js                                                          
│      users.js                                                          
│                                                          
└─views                                                          
    │  add_user.ejs                                                          
    │  all_users.ejs                                                          
    │  cal_weather.ejs                                                          
    │  chat.ejs                                                          
    │  chatIndex.ejs                                                          
    │  dashboard.ejs                                                          
    │  easter_egg.ejs                                                          
    │  edit_user.ejs                                                          
    │  home.ejs                                                          
    │  index.ejs                                                          
    │  messages                                                          
    │  nb_weather.ejs                                                          
    │  new.ejs                                                          
    │  profile.ejs                                                          
    │  protocols.ejs                                                          
    │  register.ejs                                                          
    │  show.ejs                                                          
    │  tor_weather.ejs                                                          
    │  van_weather.ejs                                                          
    │  weather.ejs                                                          
    │                                                          
    ├─admin                                                          
    │      addCategory.ejs                                                          
    │      addPage.ejs                                                          
    │      addProduct.ejs                                                          
    │      categories.ejs                                                          
    │      editCategory.ejs                                                          
    │      editPage.ejs                                                          
    │      editProduct.ejs                                                          
    │      pages.ejs                                                          
    │      products.ejs                                                          
    │                                                          
    └─layouts                                                          
  	adminFooter.ejs                                                          
	adminHeader.ejs                                                          
	adminNavbar.ejs                                                          
	footer.ejs                                                          
	header.ejs                                                          

5. How to install / run the project 

What does the developer need to install:
language(s): JavaScript, HTML, CSS

IDEs: VSCode, run “npm install” 
Database(s): MongoDB compass
Other software: n/a
3rd party APIs and frameworks: jQuery, Bootstrap (no need to download extra applications).
API keys: OpenWeather API key pre-set in files.

Link to the testing plan we have completed: https://docs.google.com/spreadsheets/d/1yy8mlObKDTYz5ZGu63RylbIUfQ050gVj5AyOALpcMkU/edit#gid=394496370


6. How to use the product (Features) 

Postings
1. Click on "Blog" in the navbar then click the "Create Posting" button in the "Postings" page.
2. In the "What's on your mind?" page, user can write in all the fields.
3. In the same page, click the "Post" button to create posts and be redirected to the "Postings" page, which should contain the new posting.
Store (in development)
1. Click on STORE in the admin dashboard. Under the PAGES page, click on "Add a new page", fill in the fields, and click Submit to add a new page (that products will eventually be displayed on, in the customers’ end).
2.Under the CATEGORIES page, click on "Add a new category", fill in the title field, and click Submit. A new category should be generated.
3. Under the PRODUCTS page, click on "Add a new product", fill in all input fields (including images), and click Submit. A new product should be generated and displayed.

Weather
1. Click on Weather in the home page, under the Menu dropdown.
2. Click “allow” on popup window
3. On the weather page, enter a city name and click the SUBMIT button.
4. Verify whether or not all of them refer to specified Canadian cities.

Protocols
1. Click on protocols in the home page, under Menu dropdown.
2. Find the desired extreme weather event.
3. Click on the it and the information is then displayed.
4. Read the information and decide how to prepare in the case of the extreme weather event.

Chat
1. In the Protocols page, click the chat button (bottom right side of the page), and click "Join Chat" in the AtmosChat page.
2. Click the "Leave Room" button (top right side in the chat room)
3. Set up and launch two http://localhost:8000/chatIndex, and have two users join the same room.
4. Enter text in the message field.
5. Press enter or click "Send" in the chat room.
6. Have one user in the chat room send a message. The other user should see the message in their browser.

User profile
1. Login as admin user.
2. Click the icon on the top right corner.
3. Review all the registered users.
4. Click the “Delete” button to delete a user.
5. Click the “Edit” button to edit a user.
6. Click the “Add User” to add a new user.
7. Logout and login as a regular user.
8. Click the “MENU” button and choose “PROFILE”.
9. Click the “Edit” button to edit a user. 




7. Credits, References, and Licenses 
Bootstrap (Cards · Bootstrap v5.2 (getbootstrap.com))
https://www.geeksforgeeks.org/express-js-res-render-function/
Ali Babar (https://creativebabar.com/html-css-node-js-express-and-mongodb-in-hindi-in-2022/)
Greg Lim - Beginning Node.js, Express & MongoDB Development
https://fonts.googleapis.com/css2?family=Nanum+Gothic&family=Ubuntu:wght@300&display=swap
https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
Technostackworld (ttps://youtu.be/tLCU2RupVo4)
George Martsoukos ( https://webdesign.tutsplus.com/tutorials/build-a-simple-weather-app-with-vanilla-javascript--cms-33893/)
https://stackoverflow.com/questions/9973955/formatting-the-phone-number
Brad Traversey (https://github.com/bradtraversy/chatcord/blob/master/public/js/main.js, https://github.com/bradtraversy/chatcord/blob/master/public/chat.html, https://github.com/bradtraversy/chatcord/blob/master/public/index.html, https://github.com/bradtraversy/chatcord/blob/master/server.js)
easylearning97 (https://www.youtube.com/watch?v=5b3-fAufjEk&list=PL78sHffDjI75uMmHCqxil_YROcHl5ONNj)
Sahil Kumar(https://youtu.be/7NnBCKJTZkc, https://youtu.be/nvSVZW2x8BQ, https://youtu.be/6LaGLqUHKms)
somteacodes (https://github.com/somteacodes/nodecrudblog/blob/Lesson-one/views/index.ejs)
Cand Dev (https://youtu.be/6LaGLqUHKms)

8. Contact Information 

Chris Wu          cwu213@my.bcit.ca

Curtis Chao       cchao38@my.bcit.ca

Jonathan Liu      jliu436@my.bcit.ca

Bo Zhou           bzhou24@my.bcit.ca




