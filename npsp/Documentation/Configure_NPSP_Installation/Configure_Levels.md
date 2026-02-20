Configure Levels
Learn about NPSP Levels, how to create new level fields, how to secure and provide access to the Level
object and fields, and how to add value to target picklists.
186

![Image](images/page_190_img_1.png)



About Levels
The NPSP Levels feature lets you track your constituents' level of commitment and engagement based
on criteria such as total gifts or number of hours volunteered.
Set Object and Field-Level Security
Enable access to the Level object and its fields for each profile that will be using Levels.
Create Level Fields on Contacts, Accounts, or other Objects
To show Level and Previous Level on Contacts, Accounts, or other objects, create custom fields and
add them to your page layouts.
Add Value to Target Picklist
When you create a Level structure, you choose the object that the Level structure applies to by making
a selection in the Target field. By default, you can select Account or Contact. If you're tracking Level
values on an object other than Account or Contact, add that object to the Target field on the Level
object.
(Optional) Give Users Access to the npsp.LVL_LevelEdit Page
System Administrators have access to the npsp.LVL_LevelEdit Visualforce page by default, but other
profiles don't. If you want users with other profiles to manage Levels, you must give them access to the
Visualforce page.
About Levels
The NPSP Levels feature lets you track your constituents' level of commitment and engagement based
on criteria such as total gifts or number of hours volunteered.
NPSP Levels uses the following objects:
•
Level (custom object): Each level record you configure indicates a particular level of commitment, for
example, Gold, Bronze, or Silver, that you can then assign to your constituents.
FFeeaattuurree RReelleeaassee IInnffoorrmmaattiioonn
This feature was released in NPSP version 3.81 (9/14/2016).
Set Object and Field-Level Security
Enable access to the Level object and its fields for each profile that will be using Levels.
To set object and field access:
11.. Click , then click Setup.
22.. Enter Profiles in the Quick Find box, then click Profiles.
33.. Click the name of the Profile you want to set security for.
44.. Click Edit.
55.. In the Custom Object Permissions section, select Read, Edit, Create, and Delete for the Level object.
This gives all users with this profile full access to use Levels. Depending on the profile, you may want to
187

![Image](images/page_191_img_1.png)



grant different access.
66.. In the Custom Tab Settings section, select Default On to include the Level tab in your list of tabs or
Default Off to make the tab accessible in App Launcher.
77.. In the Field-Level Security section, click View next to GAU Allocations.
88.. Make sure Read Access or Edit Access is checked for all fields. If not, click Edit and select the
checkbox.
99.. Click Save.
Create Level Fields on Contacts, Accounts, or other Objects
To show Level and Previous Level on Contacts, Accounts, or other objects, create custom fields and add
them to your page layouts.
These instructions are for the Account object, but they apply to Contact or any other object for which
you want to display Levels.
11.. From Setup, click the Object Manager tab.
22.. In the list of objects, click Account.
33.. Click Fields & Relationships.
44.. Click New to create a new field to display Level.
55.. Give the field an appropriate name (we suggest Level).
66.. Select Lookup Relationship as the field type, then click Next.
77.. Select Level as the related object, then click Next.
88.. Enter a Description and Help Text, then click Next.
99.. Select the appropriate Field-Level Security for each profile, then click Next.
1100.. Select Page Layouts to add the new field to, then click Next.
1111.. If you don’t want to include the related list, deselect Add Related List, then click Save.
1122.. Repeat these steps to create a second Lookup Relationship field called Previous Level.
Note To display Levels on an object other than Contact or Account, there's an additional step
required. For more information, see Add Value to Target Picklist.
Once you've created Level structures, the values of the Level and Previous Level fields on Account,
Contact, or other objects you configured are automatically updated every night by a batch job. Learn
more in Create and Manage Levels.
Add Value to Target Picklist
When you create a Level structure, you choose the object that the Level structure applies to by making a
selection in the Target field. By default, you can select Account or Contact. If you're tracking Level values
on an object other than Account or Contact, add that object to the Target field on the Level object.
First, find the API name of the object you plan to add. In this example, we're using the Affiliation object,
but the instructions apply to any object:
188

![Image](images/page_192_img_1.png)



11.. From Setup, click the Object Manager tab.
22.. From the list of objects, click the name of the object you wish to add, for example, Affiliation.
33.. Make a note of the API Name of the object. In this example, it's npe5__Affiliation__c.
Now add that value to the Target picklist on the Level object:
11.. From Setup, click the Object Manager tab.
22.. From the list of objects, click Level, then click Fields & Relationships.
33.. Click Target.
44.. In the Values related list, click New, then enter the API name of the object you want to add. In this
example, we enter npe5__Affiliation__c.
55.. Save your changes.
(Optional) Give Users Access to the npsp.LVL_LevelEdit Page
System Administrators have access to the npsp.LVL_LevelEdit Visualforce page by default, but other
profiles don't. If you want users with other profiles to manage Levels, you must give them access to the
Visualforce page.
This page is required to use the New and Edit buttons on Levels.
11.. From Setup, enter Profiles in the Quick Find box, then click Profiles.
22.. Click the name of the Profile you want to edit.
33.. In the Enabled Visualforce Page Access related list, click Edit.
44.. Move npsp.LVL_LevelEdit into the Enabled Visualforce Pages list.
189

![Image](images/page_193_img_1.png)



55.. Click Save.
66.. Repeat for each profile that needs access to Levels.
