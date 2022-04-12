The front-end server is Windows 2019, this server is running IIS. IIS is configured with two virtual directories associated to Application Pools, WEB and API. Each Application Pool is run with a distinct Active Directory account, the API App pool is the account with access into the SQL Database Backend.
The authentication is provided by ADFS 4.0 running on another Windows 2019 server. ADFS is configured with an application group Relying Party Trust using a GUID. When browsing to the web site to work with the data, the connection is redirected to ADFS to generate a WS Fed Token cookie for authentication. 
The IIS API uses the Cookie against ADFS for each request made. The token is also used to get the UPN of the user accessing the site, as well as all claims associated with the relying party trust. For the logged in user, it pulls app generated metadata that isn't stored in AD like Filer Type, Reporting Status, etc. But also, for things like pulling the employee list or generating new forms, it uses the entire employee database in SQL when doing these things.
Employee Database has 3 tables:
•	Employee
o	Columns:
	Ein
	Upn
	SamAccountName
	Type
	Company
	Dept
	Division
	Office
	GivenName
	MiddleName
	Surname
	PreferredName
	DisplayName
	Title
	EmailAddress
	StreetAddress
	City
	State
	PostalCode
	OfficePhone
	MobilePhone
	MailNickName
	Inactive
	InactiveDate
	ManagerEin
	CreatedTime
	ModifiedTime
	ReportsToEmployeeId
	DepartmentId
•	EmployeeAttribute
o	Columns:
	Id
	Attribute
	value
•	EmployeeGroup
o	Columns:
	ID
	Name
	EmployeeID
The Microsoft SQL server is used for All Data storage and is only accessed by the API App pool.
When the website is accessed EXTERNALLY all connections are sent through a Web Application Proxy Server sitting on Windows Server 2019, inside the DMZ. The interactions on the website are sent to the API and handled as needed in the database.

Process Overview:

1)	Traffic goes to the website
a)	If internal it goes straight to the website
b)	If external it goes through the WAP then to the Website.
2)	The website redirects to the API which then requests the claim cookie from ADFS
3)	ADFS Supplies the cookie for authentication
a.	It uses the Application Group GUID to check the Application Group RPT
4)	The website then makes a REST call to the API with credentials
a)	API receives the response from SQL
b)	Website displays the data
c)	Additional Processes
d)	API Queries Employee table
e)	API Sends Information to SQL to store in Table
f)	API Sends Mail not sent to mail relay to be Sent

Basic Installation Steps:
1.	Download code from Github
2.	Load up the solution
3.	Create a Database for the application
a.	Run the Migration project in the solution of the application, it will create all the tables needed
4.	Create an account database
a.	Include the tables with the columns specified
5.	Edit the configs in the solution to point to the database mapping created
6.	Edit the mail config to use target relay
7.	If using IIS Create a Site
a.	Deploy the Server code to API directory
i.	Ex: ethicsSite.com/api
b.	Deploy Client code to the root of the site 
i.	Ex: ethicsSite.com

