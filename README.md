# Client-Server-Project

This is a group project for Louisiana Tech's CSC-446 Access Control and Covert Channels class. 

This project is an on going project that access controls are added for each assignment

We were given a basic template of a website that included a query page to pull all data from a database

- Assignment 1 (Authentication)
  - Create users and add them to a database, include Username, Password (SHA256 hased), Email, Role
  - Add a login page to get to the query page

- Assignment 2 (encrypting)
  - Add salts to the passwords
  - use JASON web token (jwt) to create a login expiration

- Assignment 3 (Authroization)
  - Authorize only certain roles to access certain database tables
  
- Assignment 4 (Multi-Factor authentication)
  - Create a seperate app that generates a token that needs to be input into another screen on the website to authorize access
