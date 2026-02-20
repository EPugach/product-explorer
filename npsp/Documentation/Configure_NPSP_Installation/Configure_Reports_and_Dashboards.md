Configure the Reports & Dashboards Package
After you download the NPSP Reports package, configure it to meet your needs.
About the Reports & Dashboards Package
NPSP Reports contains community-contributed reports and dashboards covering donors and giving
history, grants, memberships, campaign ROI, and more. This feature includes dozens of reports and
several dashboards.
Verify Reports and Dashboards Settings are Enabled
Enable the reports and dashboards setting in Setup if it's not already enabled.
Verify Grant Record Type
In the NPSP reports package, the Grant record type is used in report filters. Make sure the record type
you use for grants is named correctly.
Install the Reports Package
Use the link to install the NPSP reports package.
Hide Old NPSP Reports and Folders
If your org has the old NPSP report folders (NPSP 3.0 Donor Management Reports, NPSP 3.0 Grants
Management Reports, NPSP 3.0 Membership Management Reports), we recommend that you phase
them out by hiding the folders from your users.
About the Reports & Dashboards Package
NPSP Reports contains community-contributed reports and dashboards covering donors and giving
history, grants, memberships, campaign ROI, and more. This feature includes dozens of reports and
several dashboards.
FFeeaattuurree RReelleeaassee IInnffoorrmmaattiioonn
This feature was released in NPSP version 3.90 (2/14/2017).
Verify Reports and Dashboards Settings are Enabled
Enable the reports and dashboards setting in Setup if it's not already enabled.
11.. Click , then click Setup.
22.. Enter Reports and Dashboards in the Quick Find box, then click Reports and Dashboards
Settings.
33.. Look for an Enable button. It is typically present in older orgs. If you see the button, click it. If you
260

![Image](images/page_264_img_1.png)



don't see the button, move to the next step.
Verify Grant Record Type
In the NPSP reports package, the Grant record type is used in report filters. Make sure the record type
you use for grants is named correctly.
11.. From Setup, click the Object Manager tab.
22.. In the list of objects, click Opportunity.
33.. Click Record Types.
44.. Verify that you have a record type named Grant.
55.. If you don’t see the Grant record type, create one.
••
Record Type Label: Grant
••
Record Type Name: Grant
••
Sales Process: Grant
••
Active: selected
66.. Select the profiles that should have access to this record type.
77.. Click Next.
88.. Select the Grant Layout for the appropriate profiles.
99.. Click Save.
Important If you already have a Grant record type but the name is something other than Grant, you
still need to create a Grant record type. After installation you can point the Opportunity Record Type
filter in the Grants this Year report to the correct Grant record type and delete the one you created
just for the install.
Install the Reports Package
Use the link to install the NPSP reports package.
Note You must have a System Administrator profile to install the Reports package, as the System
Administrator profile has the permissions necessary to successfully install.
11.. Go to the NPSP Reports and Dashboards Installer.
22.. Log in with your Salesforce credentials.
33.. Click Install.
Hide Old NPSP Reports and Folders
If your org has the old NPSP report folders (NPSP 3.0 Donor Management Reports, NPSP 3.0 Grants
Management Reports, NPSP 3.0 Membership Management Reports), we recommend that you phase
261

![Image](images/page_265_img_1.png)


![Image](images/page_265_img_2.png)



them out by hiding the folders from your users.
Administrators will still see the old folders. That way, if a user asks for a specific old report, you'll still have
access to it. If users don't ask about the old reports for a particular amount of time (defined by you, of
course), you can decide if you want to delete the folders and Reports.
Note If you org existed before Summer 2013, you may need to enable enhanced folder sharing
before you can hide folders. See Turn On Enhanced Folder Sharing for Reports and Dashboards for
more information.
To hide the old reports folders from users:
11.. Click the Reports tab.
22.. In the row for the folder you want to hide, click , then click Share.
33.. To hide this folder from the user, click the edit icon next to the user's access setting. We
recommend you hide the old NPSP 3.0 folders from all non-Admin users.
Note To change folder access so that users can only view reports, but not edit them, make sure
access is set to View. We recommend you give View access on the new NPSP report folders to all
non-Admin users. This decreases the chance of users accidentally overwriting your base reports.
44.. Click Done.
