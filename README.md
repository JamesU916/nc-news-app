# NC News Seeding

1. **Project Summary**

This project is an interactive news API utilising both JavaScript and PostgreSQL, where users are able to search for, sort, filter, read and interact with articles through comments and votes.\
It is accessible through https://nc-news-app-n7gp.onrender.com/api.


2. **Cloning and setting up dependencies**

Initially, you will want to clone the repo from my GitHub, accessible through https://github.com/JamesU916/nc-news-app.\
Once it is locally on your machine, you will want to ensure that you have Node.js installed at a minimum version of v23.0.0.\
Next, use 'npm i' or 'npm install' to install all the required dependencies. Here, PostgreSQL(pg) requires a minimum version of v8.13.3.

**NOTE** - All of the required dependencies and dev dependencies with their minimum required versions are stated in the package.json file.


3. **Setting up .env files**

In order to run this locally, you need to create 2 .env files:\
The first of which is '.env.development' which needs to contain 'PGDATABASE=nc_news' and 'PGPASSWORD=your_password_here'.\
The second is '.env.test' which needs to contain PGDATABASE=nc_news_test and 'PGPASSWORD=your_password_here'.\
PGPASSWORD is the same password you used to set up PostgreSQL. It may or may not be necessary depending on whether you have a '.pgpass' file set up.

**IMPORTANT** - remember to put both .env files into the '.gitignore' file with .env.* for security to ensure that they only exist locally.


4. **Setting up databases**

Now, you are ready to set up the databases locally, you can do this by running 'npm run seed-dev' in the terminal, and then 'npm run setup-dbs'.\
The application will now be ready to test to ensure that it is working correctly. This is done by running 'npm t' or 'npm test' in the terminal.


5. **The application is now ready to use!**


