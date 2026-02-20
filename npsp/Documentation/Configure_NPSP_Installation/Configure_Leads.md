Configure Leads
Configure leads by mapping custom lead fields and setting the default action for creating opportunities
from leads.
Map Custom Lead Fields
Before you convert Leads, understand how standard fields map to Contact, Account, and Opportunity
fields.
Set Your Default Action for Creating Opportunities
223

![Image](images/page_227_img_1.png)



In NPSP, you can determine if Opportunities are created when you convert Leads. Before you decide,
take a moment to reflect on your organization's processes and identify what type of prospect you're
using Leads to capture.
Map Custom Lead Fields
Before you convert Leads, understand how standard fields map to Contact, Account, and Opportunity
fields.
For more information on mapping, see Lead Conversion Field Mapping.
You can also map custom Lead fields.
11.. From Setup, click the Object Manager tab.
22.. Click Lead.
33.. Click Fields & Relationships.
44.. Click Map Lead Fields.
55.. Map fields to meet your organization's needs.
There are some limitations and best practices when mapping custom Lead fields. For more information,
see Guidelines for Mapping Custom Lead Fields for Lead Conversion.
PPhhoonnee aanndd EEmmaaiill FFiieellddss
It's important to understand the Phone and Email Workflow Rules before setting up Lead field mapping
because you can't map from the standard Lead phone and email fields to the custom NPSP phone and
email fields.
Let's look at an example.
To fill the Personal Email field on the Contact when converting a Lead, follow these steps:
Now when you convert a Lead, the standard mapping writes the Lead email field to the Contact email
field and the workflow rule copies the email to the Personal Email field. Set up the same mapping for
phone fields.
11.. Enable the Contact.EmailChanged_Personal workflow rule.
22.. In Map Lead Fields, set Preferred Email under Lead Fields to Preferred Email under Contact
Fields.
33.. Click Save.
Set Your Default Action for Creating Opportunities
In NPSP, you can determine if Opportunities are created when you convert Leads. Before you decide,
224


take a moment to reflect on your organization's processes and identify what type of prospect you're using
Leads to capture.
For example, if you're using Leads to find prospective donors, you likely want the Opportunity record
created when you determine that the Lead will become a donor. On the contrary, if you're using Leads to
find more volunteers, you may not want to create an Opportunity when you convert a Lead. Read this
article for more examples of why and how to use Leads.
It's important to understand this setting simply determines if the Do Not Create a New Opportunity
upon Conversion checkbox is selected (or not) by default on the Lead Conversion page. So, if this setting
is defaulted to create an Opportunity, but you come across a Lead that shouldn't have an Opportunity
when converted, you can manually change that on the Lead conversion page.
By default, NPSP does NOT create an Opportunity when you convert a Lead. If you want to change that
behavior:
11.. On the NPSP Settings tab, click People | Leads.
Note If you don't see the NPSP Settings tab in your org, you can find it in the App Launcher.
22.. Click Edit and select Create Opportunity on Lead Convert.
33.. Click Save.
