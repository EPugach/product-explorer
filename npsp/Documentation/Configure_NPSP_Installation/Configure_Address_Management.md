Configure Address Management
Learn how to configure address management features including address verification, seasonal addresses,
and bad address management.
Note Watch the Nonprofit Salesforce How-To Series video NPSP Verify Mailing Addresses
About Address Management
Address management functionality allows you to record and keep a history of different types of
addresses for Accounts, such as home, work, and seasonal addresses. Address management also
supports address verification services.
Configure Address Management Settings
By default, this setting is not selected, which means Household Accounts come out-of-the-box with
Address Management functionality enabled.
Configure Undeliverable Address Management
Set these checkbox fields to Read and Edit in your profiles and permission sets.
Adjust the Seasonal Address Batch Size
Salesforce runs the Seasonal Address Updates scheduled job that sets seasonal addresses as the
mailing address once per night. The default batch size for this job is 10. Here's how to adjust the batch
83

![Image](images/page_87_img_1.png)


![Image](images/page_87_img_2.png)


![Image](images/page_87_img_3.png)



size.
Configure Address Verification
The Nonprofit Success Pack lets you verify addresses as you enter them in Salesforce.
How do Address Updates Work?
This table outlines Address behavior in NPSP.
Configure Permissions for Managing Household Account Information
Set permissions for updating Household members.
About Address Management
Address management functionality allows you to record and keep a history of different types of
addresses for Accounts, such as home, work, and seasonal addresses. Address management also
supports address verification services.
Configure Address Management Settings
By default, this setting is not selected, which means Household Accounts come out-of-the-box with
Address Management functionality enabled.
HHoouusseehhoolldd AAccccoouunntt AAddddrreesssseess DDiissaabblleedd
To change this setting, and disable Address Management for Household Accounts:
11.. From App Launcher ( ), find and select NPSP Settings, and then click People | Addresses.
22.. Click Edit.
33.. Select the Household Account Addresses Disabled checkbox
44.. Click Save.
OOrrggaanniizzaattiioonnaall AAccccoouunntt AAddddrreesssseess EEnnaabblleedd
By default, this setting is not selected, so Organization Accounts do not have Address Management
functionality out-of-the-box. To change this setting, and enable Address Management for Organization
Accounts:
11.. From App Launcher ( ), find and select NPSP Settings, and then click People | Addresses.
22.. Click Edit.
33.. Select the Organizational Account Addresses Enabled checkbox.
44.. Click Save.
84

![Image](images/page_88_img_1.png)


![Image](images/page_88_img_2.png)



Tip To make full use of Address Management for Organization Accounts, add the Addresses related
list to the Organization Account page layout.
SSiimmppllee AAddddrreessss CChhaannggee TTrreeaatteedd aass UUppddaattee
This setting indicates that any address update, including a minor correction, should simply update the
existing Address record. With this setting on, NPSP doesn't create a new address record if you change
capitalization or update only one address field. If you add information to an address field that was
previously blank, NPSP doesn't consider this a simple change and creates a new address record. To
change this behavior so that a simple edit creates a new Address record:
11.. From App Launcher, find and select NPSP Settings.
22.. Click People | Addresses.
33.. Click Edit.
44.. Deselect the Simple Address Change Treated as Update checkbox.
55.. Click Save.
Configure Undeliverable Address Management
Set these checkbox fields to Read and Edit in your profiles and permission sets.
•
Undeliverable Mailing Address on the Contact object.
•
Undeliverable Billing Address on the Account object.
•
Undeliverable on the Address object.
Adjust the Seasonal Address Batch Size
Salesforce runs the Seasonal Address Updates scheduled job that sets seasonal addresses as the mailing
address once per night. The default batch size for this job is 10. Here's how to adjust the batch size.
11.. From App Launcher ( ), find and select NPSP Settings, and then click Bulk Data Processes | Batch
Process Settings.
22.. Click Edit and adjust the Seasonal Address Batch Size as needed.
33.. Click Save.
Configure Address Verification
The Nonprofit Success Pack lets you verify addresses as you enter them in Salesforce.
The Nonprofit Success Pack lets you verify addresses as you enter them in Salesforce using one of three
address verification APIs. You must be using the Household Account model or have address
management enabled for Organizational Accounts to use an address verification service. Address
85

![Image](images/page_89_img_1.png)


![Image](images/page_89_img_2.png)



verification is not supported in the 1-to-1 or Individual "Bucket" Account models.
Important Address verification is not performed on addresses imported or updated using the NPSP
Data Importer.
Once you've set up Salesforce for address verification, Salesforce:
•
Checks to see if addresses exist when you try to add them
•
Standardizes addresses for you (i.e. converts "Street" to "St" in the saved record, etc.)
Important Address verification only works for records you create after you've set up address
verification. Verification does not apply to contact information that you may have previously entered
in Salesforce.
SSeett UUpp AAddddrreessss VVeerriifificcaattiioonn
11.. From App Launcher ( ), find and select NPSP Settings, and then click People | Addresses.
22.. Click Edit.
33.. Review the general instructions under the Verification API Account Settings section and click Enable
Automatic Verification.
44.. Select the address verification service you want to use and enter the appropriate information. For
more specific guidance on the individual verification services available, see below.
55.. (Optional) Select Reject Ambiguous Addresses to mark ambiguous addresses as invalid when the API
returns more than one address. If not selected, Salesforce chooses the first suggested address as the
valid address.
66.. Click Save.
77.. (Optional) Click the Verify All Addresses button to mass verify addresses that already exist in your
organization. Remember, Salesforce only verifies those addresses you enter after you've set up your
address verification service. This option is available with the SmartyStreets API only.
Note To exclude an Address from being verified, select Verified on the Address record. Address
Verification skips any record with this checkbox selected.
Smarty Streets API
The SmartyStreets Address Verification API requires you to enter both an Authentication ID and
an Authentication Token. These should be available to you in the API Keys section of your
SmartyStreets account. Visit the SmartyStreets website for more information.
Note The NPSP integration with SmartyStreets Address Verification API only verifies U.S.-
based addresses.
86

![Image](images/page_90_img_1.png)


![Image](images/page_90_img_2.png)


![Image](images/page_90_img_3.png)


![Image](images/page_90_img_4.png)


![Image](images/page_90_img_5.png)



Cicero API
The Cicero Address Verification API requires you to enter an API Key.
When using the Cicero Address Verification API, select Prevent Address Overwrite to prevent
Cicero from overwriting existing addresses during the verification process.
Google Geocoding API
The Google Geocoding Address Verification API requires you to enter an API Key. This should be
available to you in your Google account's Developers Console.
How do Address Updates Work?
This table outlines Address behavior in NPSP.
For Organization Accounts, this assumes that Organizational Account Addresses Enabled is enabled in
NPSP Settings | People | Addresses.
Change What happens on Household What happens on Organization
Accounts? Accounts?
Use the Change Address button A new Address record is created N/A
on the Manage Household page in the Addresses related list. The
to change an address new Address is automatically
marked as Default Address and
is copied to all Contacts' Mailing
Address fields (except Contacts
that have the Override Address
box checked).
Modify the Billing Address fields A new Address record is created A new Address record is created
on an Account in the Addresses related list. The in the Addresses related list. The
new Address is automatically new Address is automatically
marked as Default Address and marked as Default Address.
is copied to all Contacts' Mailing
Address fields (except Contacts
that have the Override Address
box checked).
Modify the Mailing Address on a A new Address record is created N/A
Contact (Override Address box in the Household Account's
IS NOT checked) Addresses related list. The new
Address is automatically marked
as Default Address and is copied
to the Household Account's
87


Change What happens on Household What happens on Organization
Accounts? Accounts?
Billing Address fields and all
Contacts' Mailing Address fields.
Modify the Mailing Address on a A new Address record is created N/A
Contact (Override Address box in the Household Account's
IS checked) Addresses related list, but the
change only affects the Mailing
Address fields on the Contact
you updated.
Modify an Address record The change is copied to the The change is copied to the
marked as Default Household Account's Billing Organization Account's Billing
Address fields and all Contacts' Address fields.
Mailing Address fields (except
Contacts that have the Override
Address box checked).
Modify an Address record that IS The change affects the Address The change only affects the
NOT marked as Default record you updated. If any Address record you updated.
Contacts are using this Address
(with Address Override), the
change is copied over to the
Contact's Mailing Address fields.
Mark an Address record as The Address from the record you The Address from the record you
Default marked as Default is copied to marked as Default is copied to
the Household Account's Billing the Organization Account's
Address fields and all Contacts' Billing Address fields.
Mailing Address fields (except
Contacts that have the Override
Address box checked).
Create a new Address from the A new Address record is created, The address IS NOT copied to
Addresses related list on an but the Address IS NOT copied the Organization Account's
Account and do NOT mark as to the Household Account's Billing Address fields.
Default Billing Address fields.
Create a new Address from the The Address from the new The Address from the new
Addresses related list on an record is copied to the record is copied to the
Account AND mark it as Default Household Account's Billing Organization Account's Billing
Address fields and all Contacts' Address fields.
Mailing Address fields (except
Contacts that have the Override
Address box checked).
88


Configure Permissions for Managing Household Account Information
Set permissions for updating Household members.
Ask your Salesforce admin to manage Household Accounts for things like splitting or merging
Households. If your Salesforce admin is having difficulty using the Household Account management
tools, double check their permissions and page layouts.
Add the Manage Household Lightning Action on the Household Account page layout.
These are the permissions your admin needs to manage Household Accounts:
•
Object access: Add Read, Create, Delete, View All Records, and Modify All Records access to Accounts,
Contacts, and Addresses.
•
Visualforce page access:
- npe01.ContactMerge
- npe01.ContactNewOverride
- npo02.manageHousehold
- npsp.CON_DeleteContactOverride
- npsp.HH_ManageHH
- npsp.HH_ManageHHAccount
- npsp.HH_ManageHousehold
•
Apex Class access: All of the classes that start with:
- npsp.ACCT
- npsp.ADDR
- npsp.CON_ContactMerge
- npsp.HH
- npsp.Addresses
- npsp.ContactAndOrgSettings
- npsp.FieldMappings
- npsp.HouseholdId
- npsp.HouseholdMembers
- npsp.HouseholdName
- npsp.HouseholdNamingExclusionsCheckboxes
- npsp.HouseholdNamingExclusionsString
- npsp.HouseholdNamingUserControlledFields
- npsp.Households
- npsp.HouseholdSelector
- npsp.HouseholdSettings
- npsp.LegacyHouseholdMembers
- npsp.LegacyHouseholds
- npsp.LegacyHouseholdSelector
- npsp.NamingExclusions
89


