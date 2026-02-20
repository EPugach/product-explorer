Configure Recurring Donations
Learn how to set security permissions, deploy components, and configure settings to use Recurring
Donations in your org.
About Recurring Donations
Recurring Donations allows you to track gifts that donors have pledged over a period of time, including
monthly, quarterly, yearly, and custom installment schedules.
246


Assign Apex Classes
Give users access to Apex classes so they can work with Recurring Donations.
Review Recurring Donation Settings
Before you begin using Recurring Donations, you should review, confirm, and optionally edit your
Recurring Donations settings. NPSP provides default values, but you can change them at any time.
Adjust Object Permissions for Recurring Donations
Provide object permissions so users can view, create, and edit recurring donations.
Deploy Recurring Donation Lightning Components
Recurring Donations include Lightning record page components that provide details about upcoming
installment Opportunities and schedule information. Deploy these components to get the most out of
tracking recurring donations in NPSP.
Assign Enhanced Recurring Donations Page Layout
Assign the Enhanced Recurring Donations page layout to all user profiles that need access to
Recurring Donations.
About Recurring Donations
Recurring Donations allows you to track gifts that donors have pledged over a period of time, including
monthly, quarterly, yearly, and custom installment schedules.
This feature accommodates both Open-Ended (no end date set) and Fixed-Length (end date set)
Recurring Donations.
Recurring Donations primarily uses these objects:
•
Recurring Donation (custom object): Used to set the donor, schedule, and amount for the Recurring
Donation.
•
Opportunity (standard object): Used to track each individual installment for the Recurring Donation.
For continuous installment generation, recurring donation owners must be active users. These owners
also own related opportunities. NPSP stops generating new opportunity installments if the owner
becomes inactive.
Note Record Types are not fully supported in NPSP Recurring Donations. You can have record types
configured, but your users can't select the record types in the Recurring Donations entry form.
Instead, NPSP will use the default record type for their profile.
Assign Apex Classes
Give users access to Apex classes so they can work with Recurring Donations.
To ensure that you can access and configure Recurring Donations, verify that user profiles have access to
these Apex classes:
247

![Image](images/page_251_img_1.png)



•
npsp.RD2_ChangeLogController
•
npsp.RD2_EnablementDelegate_CTRL
•
npsp.RD2_EntryFormController
•
npsp.RD2_PauseForm_CTRL
•
npsp.RD2_StatusAutomationSettings_CTRL
•
npsp.RD2_StatusMappingSettings_CTRL
•
npsp.RD2_VisualizeScheduleController
•
npsp.UTIL_BatchJobProgress_CTRL
Important You must use the Enhanced Profile User Interface in order to access all available Apex
classes.
If you don't have access to these Apex classes, you'll see an error when you click Recurring Donations in
NPSP Settings and you won't have access to Recurring Donation page layout custom components.
To assign Apex classes:
11.. Go to Setup.
22.. In the Quick Find box, enter Profiles, then click Profiles.
33.. Click the name of the profile you want to edit.
44.. Click Apex Class Access.
55.. Click Edit.
66.. Add the appropriate apex classes to the Enabled Apex Class list.
77.. Save your changes.
Review Recurring Donation Settings
Before you begin using Recurring Donations, you should review, confirm, and optionally edit your
Recurring Donations settings. NPSP provides default values, but you can change them at any time.
11.. Click the NPSP Settings tab. If you don't see the tab, find it in the App Launcher ( ).
22.. Click Recurring Donations | Recurring Donations.
33.. Click Edit.
44.. Make changes as necessary, then click Save.
Setting Description
Recurring Donation Batch Size The number of records to process at a time when running
248

![Image](images/page_252_img_1.png)


![Image](images/page_252_img_2.png)



Setting Description
the Recurring Donations batch job. The default is 50.
Reduce to a smaller number if the batch job is failing due
to system limits.
Open Opportunity Behavior on RD Close Tells NPSP what to do with any remaining open
Opportunities when you change the Status of a Recurring
Donation to Closed. The options are: Delete Open
Opportunities, Mark Open Opportunities as Closed Lost,
or No Action.
Add Campaign to All Opportunities When selected, NPSP copies the Campaign you specified
on the Recurring Donation to its installment
Opportunities.
Installment Opportunity Auto-Creation Specifies when NPSP will create installment Opportunities
for Recurring Donations. The default is Always Create Next
Installment.
Enable Recurring Donation Change Log When enabled, NPSP creates a Recurring Donation
Change Log record each time amount, schedule, or
campaign fields of a Recurring Donation are updated.
Opportunity Record Type The Opportunity record type assigned to the Recurring
Donation's installment Opportunities.
Next Donation Date Match Range The number of days before or after the Next Donation
Date that NPSP won't create a new installment
Opportunity if the next open Opportunity's Close Date is
changed. Applies only to Recurring Donations where
Installment Period is Monthly or Yearly. We do not
recommend setting a value higher than 20 days. Default is
3.
Use Fiscal Year for Recurring Donations When checked, this option enables fiscal year for
Recurring Donation value totals. To set the fiscal year start
month, go to Setup | Company Settings | Fiscal Year.
NOTE: Use Standard Fiscal Year only. Do not enable
Custom Fiscal Year.
Recurring Donation Name Format When you create a Recurring Donation, NPSP
automatically populates the Name using the specified
name format. Choose Disable Automatic Naming to turn
this feature off.
Note If you enable the Recurring Donation Change Log, consider disabling field history tracking for
Recurring Donations. Seeing both could confuse your users. However, the change log and field
249

![Image](images/page_253_img_1.png)



history might track different fields.
Adjust Object Permissions for Recurring Donations
Provide object permissions so users can view, create, and edit recurring donations.
Enable Read, Create, and Edit object-level security settings on your user profiles for these objects:
•
Recurring Donations
•
Opportunities
Optionally, enable Read access on your user profiles to the Recurring Donation Change Logs object if you
wish to use that feature.
Deploy Recurring Donation Lightning Components
Recurring Donations include Lightning record page components that provide details about upcoming
installment Opportunities and schedule information. Deploy these components to get the most out of
tracking recurring donations in NPSP.
Deploy these components on your Recurring Donation Lightning record pages:
•
Recurring Donation Active Schedules
•
Recurring Donation Installments
•
Recurring Donation Change Log
To deploy the Recurring Donation Lightning components:
11.. In Setup, click Object Manager.
22.. Click Recurring Donation.
33.. Click Lightning Record Pages.
44.. Click the label of your org default Lighting record page.
55.. Click Edit.
66.. Click and drag each Lightning component onto the Lightning record page. We recommend placing the
components in a column next to the page details.
77.. Save your changes.
Assign Enhanced Recurring Donations Page Layout
Assign the Enhanced Recurring Donations page layout to all user profiles that need access to Recurring
Donations.
250


Learn how in Assign Record Types and Page Layouts in the Enhanced Profile User Interface.
Note If you enable the Recurring Donation Change Log, add the Recurring Donation Change Log
related list to the Enhanced Recurring Donations page layout.
