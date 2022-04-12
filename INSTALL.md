The front-end server is Microsoft Windows 2022 running IIS. IIS is configured with two virtual directories associated to Application Pools: WEB and API. Each Application Pool is run with a distinct Active Directory account, the API App Pool is the account with access into the SQL Database Backend. The authentication is provided by ADFS using an Application Group Relying Party Trust. 

The IIS API uses the cookie against ADFS for each request made. The token is also used to get the UPN of the user accessing the site, as well as all claims associated with the relying party trust. For the logged in user, it pulls app generated metadata that isn't stored in AD like Filer Type, Reporting Status, etc. But also, for things like pulling the employee list or generating new forms, it uses the entire employee database in SQL when doing these things.

Employee Database has 3 tables:

- Employee
  - Columns:
  - Ein
  - Upn
  - SamAccountName
  - Type
  - Company
  - Dept
  - Division
  - Office
  - GivenName
  - MiddleName
  - Surname
  - PreferredName
  - DisplayName
  - Title
  - EmailAddress
  - StreetAddress
  - City
  - State
  - PostalCode
  - OfficePhone
  - MobilePhone
  - MailNickName
  - Inactive
  - InactiveDate
  - ManagerEin
  - CreatedTime
  - ModifiedTime
  - ReportsToEmployeeId
  - DepartmentId
-	EmployeeAttribute
    - Columns:
    - Id
    - Attribute
    - Value
- EmployeeGroup
  -	Columns:
  - ID
  - Name
  - EmployeeID

The Microsoft SQL server is used for All Data storage and is only accessed by the API App pool.

Process Overview:

1.	Traffic goes to the website
  1.	If internal it goes straight to the website
  2.	If external it goes through the WAP then to the Website.
2.	The website redirects to the API which then requests the claim cookie from ADFS
3.	ADFS Supplies the cookie for authentication
  1.	It uses the Application Group GUID to check the Application Group RPT
4.	The website then makes a REST call to the API with credentials
  1.	API receives the response from SQL
  2.	Website displays the data
  3.	Additional Processes
  4.	API Queries Employee table
  5.	API Sends Information to SQL to store in Table
  6.	API Sends Mail not sent to mail relay to be Sent

Basic Installation Steps:

1.	Download code from Github
2.	Load up the solution
3.	Create a Database for the application
  1.	Run the Migration project in the solution of the application, it will create all the tables needed
4.	Create an account database
  1.	Include the tables with the columns specified
5.	Edit the configs in the solution to point to the database mapping created
6.	Edit the mail config to use target relay
7.	If using IIS Create a Site
  1.	Deploy the Server code to API directory
    	Ex: ethicsSite.com/api
  2.	Deploy Client code to the root of the site 
      Ex: ethicsSite.com

