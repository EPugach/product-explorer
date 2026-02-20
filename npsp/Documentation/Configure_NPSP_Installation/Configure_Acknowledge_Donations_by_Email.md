Configure Acknowledge Donations by Email
Configure Salesforce to send donation acknowledgment emails automatically when you enter gifts in
NPSP.
About Acknowledge Donations by Email
The NPSP Email Acknowledgment feature lets you send acknowledgment emails to donors, either in a
batch, or as one-offs for individual gifts.
Add New Values to Opportunity Acknowledgment Status
The workflow rule for acknowledgment emails relies on specific values in the Acknowledgment Status
field.
Add Fields to Page Layouts
For Opportunity record types that use Acknowledgment functionality, such as Donations and In-Kind
Gifts, add the Acknowledgment Status and Acknowledgment Date fields to the corresponding page
layouts.
Set Object and Field-Level Security
Make sure the Acknowledgment Status and Acknowledgment Date fields are set to Visible for each
profile that needs access to them.
Update Logo in Letterhead Template
Follow these steps to update the logo.
Edit the NPSP Opportunity Acknowledgment Email Template
Follow these steps to edit the NPSP opportunity acknowledgment.
Activate the Opportunity Email Acknowledgment Workflow Rule
Follow these steps to activate opportunity email acknowldegment workflow rule.
Add the Email Acknowledgments Button to the Opportunity List View
Easily send acknowledgements of selected opportunities when you add the Email Acknowledgments
button to the Opportunity list view.
About Acknowledge Donations by Email
The NPSP Email Acknowledgment feature lets you send acknowledgment emails to donors, either in a
batch, or as one-offs for individual gifts.
NPSP Email Acknowledgments uses the following objects and features:
•
Opportunity: The Acknowledgment Status field triggers a workflow to send thank you emails to
constituents.
•
Email Templates: Design the email message that NPSP sends to your donors.
Learn more about email acknowledgments in Acknowledge Donations by Email.
77


Add New Values to Opportunity Acknowledgment Status
The workflow rule for acknowledgment emails relies on specific values in the Acknowledgment Status
field.
Learn more about the acknowledgment email workflow in Configure Acknowledge Donations by Email.
Add values to the Acknowledgment Status field:
11.. From Setup, click the Object Manager tab.
22.. In the list of objects, click Opportunity.
33.. Click Fields & Relationships.
44.. Click the Acknowledgment Status field.
55.. Add these values:
••
Email Acknowledgment Now
••
Email Acknowledgment Not Sent
66.. Select the Donation record type and any other record type for which you want to email
acknowledgments.
77.. Save your work.
Add Fields to Page Layouts
For Opportunity record types that use Acknowledgment functionality, such as Donations and In-Kind
Gifts, add the Acknowledgment Status and Acknowledgment Date fields to the corresponding page
layouts.
To edit page layouts:
11.. From Setup, click the Object Manager tab.
22.. In the list of objects, click Opportunity.
33.. Click Page Layouts.
44.. Drag the Acknowledgment Status and Acknowledgment Date fields onto the page layout.
55.. Save your work.
Set Object and Field-Level Security
Make sure the Acknowledgment Status and Acknowledgment Date fields are set to Visible for each
profile that needs access to them.
To check field access:
11.. From Setup, enter Profiles in the Quick Find box, then click Profiles.
22.. Click the name of the profile you want to edit.
33.. Click Object Settings.
44.. In the list of objects, find and click Opportunities.
78


55.. Under object permissions, select Read.
Select additional object permissions as needed for this profile.
66.. Under field permissions for the Acknowledgment Status and Acknowledgment Date fields, select Edit
Access.
77.. Save your changes.
Update Logo in Letterhead Template
Follow these steps to update the logo.
11.. From Setup, in the Quick Find box, enter Letterheads then click Classic Letterheads.
22.. Click NPSP Sample Letterhead.
33.. Click Edit Letterhead.
44.. In the header section of the letterhead, click Remove Logo to remove the NPSP logo from the section.
55.. Click Select Logo to choose a new image to display in the header section.
Your logo image file must reside in your Documents folder in Salesforce.
66.. Click the name of your logo.
77.. Save your work.
Note You can only upload files to the Documents folder in Salesforce Classic. For more
information see Upload and Replace Items on the Documents tab.
Edit the NPSP Opportunity Acknowledgment Email Template
Follow these steps to edit the NPSP opportunity acknowledgment.
11.. From Setup, in the Quick Find box, enter Email Templates then click Classic Email Templates.
22.. Choose NPSP Email Templates from the Folder drop-down menu.
33.. Click NPSP Opportunity Acknowledgment to view the HTML and Text versions of the template.
44.. Edit the HTML and Text versions to meet your organization's needs.
Learn more about editing email templates in View and Edit Email Templates in Salesforce Classic.
Activate the Opportunity Email Acknowledgment Workflow Rule
Follow these steps to activate opportunity email acknowldegment workflow rule.
11.. From Setup, in the Quick Find box, enter Workflow Rules then click Workflow Rules.
22.. To view the rule's criteria, click Opportunity Email Acknowledgment.
Note This workflow is part of a managed package, so you can’t change the rule criteria. If you
79

![Image](images/page_83_img_1.png)


![Image](images/page_83_img_2.png)



need to make changes, clone the workflow and then edit the cloned version. To clone a workflow
rule, click the Workflow Rule name, then click Clone .
33.. When you’re ready to use the rule, click Activate.
CChhaannggee tthhee FFrroomm EEmmaaiill AAddddrreessss
If you want to use a different From email address:
11.. From Setup, in the Quick Find box, enter Organization-Wide Addresses, then click Organization-
Wide Addresses.
22.. Click Add.
33.. Enter a Display Name and Email Address, and choose which profiles use the From address. If you want
all profiles to use the email address, select Allow All Profiles to Use this From Address.
44.. Click Save.
55.. Salesforce sends you an email to confirm the new address. Click the link in the email to confirm.
66.. Back in Salesforce Setup, in the Quick Find box, enter Workflow Rule, then click Workflow Rules.
77.. Click Opportunity Email Acknowledgment.
88.. In the Workflow Actions section, click Opportunity Email Acknowledgment.
99.. Click Edit.
1100.. In the From Email Address field, select the new email address.
1111.. Save your work
.
Add the Email Acknowledgments Button to the Opportunity List View
Easily send acknowledgements of selected opportunities when you add the Email Acknowledgments
button to the Opportunity list view.
11.. From Setup, click the Object Manager tab.
22.. In the list of objects, click Opportunity.
33.. Click List View Button Layout.
44.. In the List View row, click , then click Edit.
55.. Under Custom Buttons, move Email Acknowledgments from the Available Buttons list to the Selected
Buttons list.
66.. Save your work.
Configure Duplicate Detection and NPSP Contact Merge
Set up duplicate detection and contact merge to keep your contacts organized and up-to-date.
Set Up Duplicate Detection
Set up duplicate detection with matching rules to identify duplicate contacts.
Set Up NPSP Duplicate Rule Settings
80

![Image](images/page_84_img_1.png)



Set up duplicate rules to find duplicate contacts before any potential duplicates are created.
Customize Contact Merge Columns
Customize the columns that appear in the Contact Merge search results.
Set Up NPSP Potential Duplicates Pane on Contacts Page
To quickly see if a contact has potential duplicates and to resolve those duplicates, set up the NPSP
Potential Duplicates component on the Contacts page.
Set Up Duplicate Detection
Set up duplicate detection with matching rules to identify duplicate contacts.
Important The out-of-box Salesforce Duplicate Rules are set up to match Contacts with Leads. This
causes issues in NPSP Contact Merge. We recommend that you deactivate the Duplicate Rule
Standard Rule for Contacts with Duplicate Leads or set up your own rules as described in the
following sections.
SSeett UUpp MMaattcchhiinngg RRuulleess
Matching Rules tell Salesforce how to look for duplicate Contacts. A Matching Rule compares field values
to determine if a record is similar enough to another record to be considered a duplicate.
11.. Click , then click Setup.
22.. From Setup, enter Matching Rules in the Quick Find box, then click Matching Rules.
33.. Click New Rule.
44.. For Object, select Contact, then click Next.
55.. Give the rule a name and an optional description.
66.. Select the fields to compare, and the matching methods.
77.. Click Save.
88.. Click Activate.
99.. Continue to the next section to create a Duplicate Rule.
For more information, see Customize Matching Rules in Salesforce Help.
SSeett UUpp DDuupplliiccaattee RRuulleess
Duplicate Rules tell Salesforce what to do when it finds potential duplicates as users create new
Contacts. To see duplicates on the Contact Merge tab, Duplicate Rules must have both Action on Create
and Action on Edit set to Allow and Report.
81

![Image](images/page_85_img_1.png)


![Image](images/page_85_img_2.png)



11.. Click , then click Setup.
22.. From Setup, enter Duplicate Rules in the Quick Find box, then click Duplicate Rules.
33.. Click New Rule, then select Contact.
44.. Give the rule a name.
55.. Next to Action on Create, select Allow and Report.
66.. Next to Action on Edit, select Allow and Report.
77.. Under Matching Rules:
aa.. Select Compare Contacts With Contacts.
bb.. Select the Matching Rule you created.
88.. Optionally add additional conditions.
99.. Click Save.
1100.. If you have Unlimited Edition or Salesforce.org Insights Platform Data Integrity, continue to the next
section.
For more information, including considerations for managing multiple Duplicate Rules, see Duplicate
Rules in Salesforce Help.
Set Up NPSP Duplicate Rule Settings
Set up duplicate rules to find duplicate contacts before any potential duplicates are created.
Before using Contact Merge, complete this one-time setup task. If you want to use Duplicate Rules for
finding duplicates it's necessary to set this up before any potential duplicates are created. If you have
custom code with the AllowSave property set to a value, that value takes precedence over this setting.
11.. Click the NPSP Settings tab. If you don't see the tab, find it in the App Launcher ( ).
22.. Click System Tools, then Error Notifications.
33.. Click Edit.
44.. Select Respect Duplicate Rule Settings.
55.. Click Save.
Customize Contact Merge Columns
Customize the columns that appear in the Contact Merge search results.
82

![Image](images/page_86_img_1.png)


![Image](images/page_86_img_2.png)



11.. Click , then click Setup.
22.. Go to Object Manager and enter Contact in the Quick Find box.
33.. Click Field Sets.
44.. Click on the Contact Merge Found field set.
55.. Click and drag to modify the fields shown and the order shown.
66.. Save your work.
Set Up NPSP Potential Duplicates Pane on Contacts Page
To quickly see if a contact has potential duplicates and to resolve those duplicates, set up the NPSP
Potential Duplicates component on the Contacts page.
11.. From a Contact page, click and select Edit Page.
22.. If the Potential Duplicates component is on the page layout, delete it.
33.. From the Custom - Managed component list, drag the NPSP Potential Duplicates component to the
page layout.
44.. Clear the checkboxes if you don't want to show the number of potential duplicates in the page card or
in the toast message.
These options are selected by default
55.. Save and activate your changes.
