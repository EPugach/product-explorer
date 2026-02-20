Configure Donation Allocations
Find out more about donation allocations.
About Donation Allocations
The NPSP Allocations feature allows you to define General Accounting Units (GAUs) to match your
chart of accounts. You can then enter and track donations as parts of a GAU—either as a percentage of
the donation amount, or as a specific dollar amount.
Set Tab Visibility
For every profile that should have access to General Accounting Units, set the General Accounting
Units tab settings.
Set Security on Objects, Fields, and Visualforce Pages
Follow these steps to set security.
Add the GAU Allocations Related List to Your Page Layouts
Follow these steps to add the GAU allocations list to your page layouts.
Create General Accounting Units
You need to create at least one General Accounting Unit (GAU) before you begin using GAU
Allocations. You can do this on the General Accounting Units tab.
Add Custom Fields to the Manage Allocations Page
You can add your own custom fields to the Manage Allocations page through the Manage Allocations
Additional Fields field set. After adding your preferred custom fields to the field set, your newly added
fields appear on the Manage Allocations page. Use the field set layout editor to indicate if a field is
required or not.
(Optional) Enable Default Allocations
You can enable a Default GAU if you want Salesforce to allocate Opportunities to a GAU upon creation.
If you have a specific Opportunity that you want to allocate to a different GAU, you can always use the
Manage Allocations button to make changes.
(Optional) Customize Allocation Rollups
GAU Allocations comes with a series of rollups that help you track the allocations you assign to your
GAUs. The rollups come with pre-defined settings, which you can update as needed.
About Donation Allocations
The NPSP Allocations feature allows you to define General Accounting Units (GAUs) to match your chart
176


of accounts. You can then enter and track donations as parts of a GAU—either as a percentage of the
donation amount, or as a specific dollar amount.
NPSP Allocations uses these objects:
•
General Accounting Unit (custom object): Track your designated funds, for example, scholarship,
general, etc.
•
GAU Allocation (custom object): Track the specific funds (GAUs) to which each donation is allocated.
•
Campaign (standard object): Manage a group of donations and a predetermined amount to allocate
to a specific GAU for donations in that Campaign.
•
Opportunity (standard object): Track the amount (or percent) allocated for each.
•
Recurring Donation (custom object): Track the amount (or percent) allocated for recurring donations.
FFeeaattuurree RReelleeaassee IInnffoorrmmaattiioonn
This feature was released in NPSP version 3.25 (11/25/2014).
Set Tab Visibility
For every profile that should have access to General Accounting Units, set the General Accounting Units
tab settings.
11.. Click , then click Setup.
22.. From Setup, enter Profiles in the Quick Find box, then click Profiles.
33.. Click the name of the Profile you want to set Field-Level Security for.
44.. Click Edit.
55.. In the Tab Settings section, set the General Accounting Units tab setting to one of the following:
••
Default On: The General Accounting Units tab appears in the list of tabs.
••
Default Off: The General Accounting Units tab is not in the list of tabs, but is accessible through
the App Launcher.
66.. Click Save.
Set Security on Objects, Fields, and Visualforce Pages
Follow these steps to set security.
11.. From Setup, enter Profiles in the Quick Find box, then click Profiles.
22.. Click the name of the Profile to which you want to grant access.
33.. Click Edit.
44.. In the Custom Object Permissions section, select Read, Edit, Create and Delete for the GAU
Allocations and General Accounting Units objects. Select Read for Payments and Recurring Donation
Objects.
55.. Save your changes.
66.. Repeat all steps for each profile that needs access to Donation Allocations.
177

![Image](images/page_181_img_1.png)



To set field-level security:
11.. From Setup, enter Profiles in the Quick Find box, then click Profiles.
22.. Click the name of the Profile to which you want to grant access.
33.. In the Field-Level Security section, under Custom Field-Level Security, click View next to GAU
Allocations.
44.. Make sure Read Access or Edit Access is selected for all fields. If not, click Edit.
55.. For all fields, if Edit Access is available, select Edit Access. Otherwise, select Read Access.
66.. Save your changes.
77.. Click Back to Profile.
88.. In the Field-Level Security section, under Custom Field-Level Security, click View next to General
Accounting Units.
99.. Make sure Read Access or Edit Access is selected for all fields. If not, click Edit.
1100.. For all fields, if Edit Access is available, select Edit Access. Otherwise, select Read Access.
1111.. Save your changes.
1122.. Repeat all steps for each profile that needs access to Donation Allocations.
To set Visualforce page security:
11.. From Setup, enter Profiles in the Quick Find box, then click Profiles.
22.. Click the name of the Profile to which you want to grant access.
33.. In the Enabled Visualforce Page Access section, click Edit.
44.. Move npsp.ALLO_ManageAllocations from Available Visualforce Pages to Enabled Visualforce Pages.
55.. Save your changes.
66.. Repeat all steps for each profile that needs access to Donation Allocations.
Add the GAU Allocations Related List to Your Page Layouts
Follow these steps to add the GAU allocations list to your page layouts.
•
Opportunity: Donation layout
•
NPSP Campaign layout
•
Recurring Donation layout
We’ll show you how to update the Opportunity page layout. After you complete that, repeat these steps
for the other layouts.
11.. From Setup, click the Object Manager tab.
22.. In the list of objects, click Opportunity.
33.. Click Page Layouts.
44.. Click Donation Layout.
55.. In the left side of the palette, click Related Lists.
66.. Drag the GAU Allocations related list onto the page layout.
178


77.. In the GAU Allocations related list, click to access the list properties.
88.. Add these fields to the Selected Fields list:
••
General Accounting Unit
••
Amount
••
Percent
99.. Click to expand the Buttons section.
1100.. Add the Manage Allocations button to the Selected Buttons section.
1111.. Click OK.
Your related list will look like this on each page layout:
Create General Accounting Units
You need to create at least one General Accounting Unit (GAU) before you begin using GAU Allocations.
You can do this on the General Accounting Units tab.
Note You can create additional GAUs at any time. If you want to transfer donations from one GAU to
another, however, you will either need to do it manually in each Opportunity or use an application
that allows you to manipulate data (like Salesforce Data Loader, or an app from the AppExchange).
11.. Click , then click General Accounting Units.
22.. On the General Accounting Units page, click New.
33.. Enter a General Account Unit Name.
44.. Click Save, or click Save and New if you want to create more GAUs.
Add Custom Fields to the Manage Allocations Page
You can add your own custom fields to the Manage Allocations page through the Manage Allocations
Additional Fields field set. After adding your preferred custom fields to the field set, your newly added
fields appear on the Manage Allocations page. Use the field set layout editor to indicate if a field is
required or not.
Important Make fields required using the Manage Allocations Additional Fields field set, not on the
GAU Allocation object.
11.. Click , then click Setup.
22.. From Setup, click the Object Manager tab.
33.. Find and click the GAU Allocation object.
44.. Click Field Sets.
55.. Click the Manage Allocations Additional Fields field label.
66.. Add your preferred fields by dragging them from the palette to the In the Field Set section.
77.. (Optional) Make the field required by clicking the field properties icon ( ), selecting Required, and
179

![Image](images/page_183_img_1.png)


![Image](images/page_183_img_2.png)


![Image](images/page_183_img_3.png)


![Image](images/page_183_img_4.png)


![Image](images/page_183_img_5.png)


![Image](images/page_183_img_6.png)


![Image](images/page_183_img_7.png)


![Image](images/page_183_img_8.png)



clicking OK.
88.. Click Save.
The field set fields appear on the Manage GAU Allocations page.
(Optional) Enable Default Allocations
You can enable a Default GAU if you want Salesforce to allocate Opportunities to a GAU upon creation. If
you have a specific Opportunity that you want to allocate to a different GAU, you can always use the
Manage Allocations button to make changes.
See Allocations Overview.
You don’t need to enable a default GAU to use GAU Allocations, but if you plan on allocating donations,
make sure you set up your GAUs accordingly. A default GAU comes in handy when you want to run
reports in Salesforce. For example, if you wanted to report on all of your donations (not just those
allocated to particular GAUs), you could run a report that included information about allocated
donations, as well as information about donations to the default GAU (often an "unrestricted" or "general
fund").
NPSP comes with a standard GAU named General Fund. You can select the General Fund GAU as your
default when you enable Default Allocations.
11.. Create a General Accounting Unit that you want to use for default allocations. (If you're using the
“General Fund" GAU that comes with NPSP as your default, you can skip this step.)
22.. Click the NPSP Settings tab. If you don't see the tab, find it in the App Launcher ( ).
33.. Click Donations | GAU Allocations.
44.. Click Edit.
55.. In the Default Allocations Setting area, select the Default Allocations Enabled checkbox.
66.. From the Default General Accounting Unit drop-down menu, select the GAU to use as your default.
77.. Click Save.
88.. (Optional) If you want to assign all current unallocated Opportunities to your default GAU, in NPSP
Settings go to Bulk Data Processes | Batch Create Default Allocations and click Run Batch. NPSP runs
through your Opportunities, looks for unallocated amounts, and assigns them to your specified
default GAU.
(Optional) Customize Allocation Rollups
GAU Allocations comes with a series of rollups that help you track the allocations you assign to your
GAUs. The rollups come with pre-defined settings, which you can update as needed.
To update the allocation rollup settings:
11.. Click the NPSP Settings tab. If you don't see the tab, find it in the App Launcher ( ).
180

![Image](images/page_184_img_1.png)


![Image](images/page_184_img_2.png)



22.. Click Donations | Customizable Rollups.
33.. Click Configure Customizable Rollups .
44.. To set an N day value or use fiscal year, in the row for the Allocation rollup you want to edit, click ,
then click Edit.
aa.. To set a Rollup N Day Value, select Days Back in the Time Frame field, then enter the number of
days back.
bb.. To use fiscal year instead of calendar year, select the Use Fiscal Year checkbox. This checkbox
appears if the Operation is set to Years Donated, Best Year, Best Year Total OR if the Time
Frame field is set to Years Ago.
55.. Exclude Opportunity record types or Opportunity types using filter rules within a filter group. Within
your filter group, create a filter rule with these values:
aa.. Object = Opportunity
bb.. Field = Record Type ID or Opportunity Type
cc.. Operator = In List
dd.. Selected Value = Only the record types (or Opportunity types) you want to include. All other values
are excluded.
Note If you wish to adjust which Opportunity record types or Opportunity types are excluded
from default GAU Allocations, you must temporarily disable Customizable Rollups. Make your
changes to Excluded Opp RecTypes and Excluded Opp Types in NPSP Settings tab, Donations |
GAU Allocations. Then you can re-enable Customizable Rollups.
66.. Remember to Save your changes!
