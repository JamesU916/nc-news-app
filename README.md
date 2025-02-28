# NC News Seeding

1. Setting up .env files
-In order to run this locally, you need to create 2 .env files. 
-The first of which is .env.development which needs to contain PGDATABASE=nc_news and PGPASSWORD=your_password_here.
-The second is .env.test which needs to contain PGDATABASE=nc_news_test and PGPASSWORD=your_password_here.
-PGPASSWORD is the same password you used to set up PostgreSQL.
-IMPORTANT - remember to put both .env files into the .gitignore password with .env.* for security to ensure that they only exist locally.
