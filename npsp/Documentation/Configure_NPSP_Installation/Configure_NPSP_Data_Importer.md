Configure NPSP Data Importer
Prepare your organization for importing data from spreadsheets by following these NPSP Data Importer
set up instructions.
About NPSP Data Importer
The NPSP Data Importer simplifies the import process into a single spreadsheet. What would have
been several CSV files becomes one row of data combining constituent and donation data. The NPSP
Data Importer, along with Advanced Mapping, then writes that data to the appropriate objects in
Salesforce.
Set Tab Visibility
Make the NPSP Data Imports tab available in the App Launcher.
Set Object and Field-Level Security
Grant access to the NPSP Data Import object and fields.
Enable and Convert to Advanced Mapping
Find out more about enabling and converting advanced mapping.
About NPSP Data Importer
The NPSP Data Importer simplifies the import process into a single spreadsheet. What would have been
several CSV files becomes one row of data combining constituent and donation data. The NPSP Data
Importer, along with Advanced Mapping, then writes that data to the appropriate objects in Salesforce.
172

![Image](images/page_176_img_1.png)


![Image](images/page_176_img_2.png)


![Image](images/page_176_img_3.png)


![Image](images/page_176_img_4.png)



NPSP Data Importer uses the NPSP Data Import object. The information from your CSV is first imported
into fields on the NPSP Data Import object, and when you process the import, that information is passed
from the fields on the NPSP Data Import object to the corresponding field on the target objects.
Note We recommend that only System Admins use the NPSP Data Importer tool. Learn how the
importer tool works in How the Import Process Works.
Set Tab Visibility
Make the NPSP Data Imports tab available in the App Launcher.
11.. Click , then click Setup.
22.. From Setup, enter Profiles in the Quick Find box, then select Profiles.
33.. For each profile that you want to give access to, click the name of the profile.
44.. Click Object Settings.
55.. In the list of objects, find and click NPSP Data Imports.
66.. Click Edit.
77.. In Tab Settings, select Default On.
88.. Save the profile settings.
Next, grant other appropriate profiles access to the NPSP Data Imports tab. Repeat the above process for
each of those profiles.
Set Object and Field-Level Security
Grant access to the NPSP Data Import object and fields.
11.. From Setup, enter Profiles in the Quick Find box, then select Profiles.
22.. For each profile that you want to give access to, click the name of the profile. (For example, click
System Administrator.)
33.. Click Object Settings.
44.. In the list of objects, find and click NPSP Data Imports.
55.. Select Read, Create, Edit, and Delete under Object Permissions.
66.. In Field Permissions, select Read Access and Edit Access for all fields.
77.. Save the profile settings.
Next, grant other appropriate profiles access to the NPSP Data Import object and fields. Repeat the
above process for each of those profiles.
Enable and Convert to Advanced Mapping
Find out more about enabling and converting advanced mapping.
Note Watch the Nonprofit Salesforce How-To Series video: Enable Advanced Mapping.
173

![Image](images/page_177_img_1.png)


![Image](images/page_177_img_2.png)


![Image](images/page_177_img_3.png)



Overview
Advanced Mapping is the logic that powers the NPSP Data Importer tool. Advanced Mapping gets your
data to the right place when you import data from a spreadsheet.
Enable My Domain
In order to use Advanced Mapping, My Domain must be enabled and deployed (if it isn't already). My
Domain is a Salesforce identity feature that adds a subdomain to your Salesforce org. It's required for
features like Advanced Mapping that are built using Lightning components in Lightning component
tabs.
Set Advanced Mapping Apex Permissions
You need to enable access to an Apex class to access Advanced Mapping. Advanced Mapping is an
important component in the NPSP Data Importer.
Enable Advanced Mapping
Follow these steps to enable advanced mapping.
Help Text Mappings that Didn't Convert
If some of your existing Help Text mappings were invalid, you'll receive a message at the bottom of the
Data Import Advanced Mapping screen with a list of Help Text mappings that didn't convert.
OOvveerrvviieeww
Advanced Mapping is the logic that powers the NPSP Data Importer tool. Advanced Mapping gets your
data to the right place when you import data from a spreadsheet.
Advanced Mapping is already set up to handle typical import scenarios involving constituent and
donation data. For most organizations, very little or no customization of Advanced Mapping is needed.
Learn more about Advanced Mapping in Advanced Mapping Overview.
Note Previous versions of NPSP used Help Text Mapping to accomplish what Advanced Mapping
does today. When you enable Advanced Mapping, NPSP automatically converts your Help Text
mappings into Advanced Mappings. You can disable Advanced Mapping and go back to Help Text
mapping at any time, but any changes you made with Advanced Mapping will be lost and won't be
synced back to Help Text.
EEnnaabbllee MMyy DDoommaaiinn
In order to use Advanced Mapping, My Domain must be enabled and deployed (if it isn't already). My
Domain is a Salesforce identity feature that adds a subdomain to your Salesforce org. It's required for
features like Advanced Mapping that are built using Lightning components in Lightning component tabs.
To find out if My Domain is enabled in your org, go to Setup and search for My Domain.
For information on setting up My Domain, see My Domain.
174

![Image](images/page_178_img_1.png)



SSeett AAddvvaanncceedd MMaappppiinngg AAppeexx PPeerrmmiissssiioonnss
You need to enable access to an Apex class to access Advanced Mapping. Advanced Mapping is an
important component in the NPSP Data Importer.
To enable this Apex class access:
11.. From Setup, type Profiles in the Quick Find box, then click Profiles.
22.. Select the profile you'd like to edit.
33.. Select Apex Class Access.
44.. Click Edit.
55.. Add the npsp.BDI_ManageAdvancedMappingCtrl class into the Enabled Apex Classes box.
66.. Click Save.
EEnnaabbllee AAddvvaanncceedd MMaappppiinngg
Follow these steps to enable advanced mapping.
11.. Click the NPSP Settings tab. If you don't see the tab, find it in the App Launcher ( ).
22.. Click System Tools | Advanced Mapping for Data Import & Gift Entry.
33.. Click the button to switch to Enabled.
44.. It may take a few moments for NPSP to convert all of your existing Help Text mappings. When your
help text has been converted to Advanced Mapping, you'll see a Configure Advanced Mapping button
on this page.
Important If your org includes invalid Help Text mappings, you’ll see another section below the
Configure Advanced Mapping button. Read more about Help Text Mappings that Didn't Convert.
When you click Configure Advanced Mapping, you see a list of the out-of-box Object Groups that
converted from Help Text mapping. You're ready to Customize Advanced Mapping.
HHeellpp TTeexxtt MMaappppiinnggss tthhaatt DDiiddnn''tt CCoonnvveerrtt
If some of your existing Help Text mappings were invalid, you'll receive a message at the bottom of the
Data Import Advanced Mapping screen with a list of Help Text mappings that didn't convert.
Important The list of invalid Help Text mappings will not be displayed again unless you disable and
re-enable Advanced Mapping; take a screenshot of this page or copy the information in the table so
you know which mappings to correct.
For more information about why these are invalid, see Troubleshoot Invalid NPSP Data Import Help Text
Mappings (Legacy).
To correct these mappings, choose one of these options:
175

![Image](images/page_179_img_1.png)


![Image](images/page_179_img_2.png)


![Image](images/page_179_img_3.png)



•
Recommended: Turn off Advanced Mapping and correct the invalid Help Text mappings in the NPSP
Data Import object. When you re-enable Advance Mapping, the Help Text mappings are converted to
Advanced Mapping.
•
This option is only appropriate if you will keep Advanced Mapping enabled indefinitely. You can
keep Advanced Mapping enabled, and click the Configure Advanced Mapping button to create these
mappings correctly using the new interface. Correcting the invalid Help Text mappings using Advanced
Mapping will not correct the help text issues on the fields. If you disable and later re-enable Advanced
Mapping, the mappings you corrected directly in the Advanced Mapping interface will be lost.
