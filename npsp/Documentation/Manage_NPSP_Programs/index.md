





•

Membership Status: A formula field using this formula: If the Membership End Date is earlier than

today, Salesforce looks to see if the end date is older than 31 days from today. If so, it will show

Expired. If less than 31 days, it will show Grace Period. If the Membership End Date has no value, this

field will be blank. If the Membership is still active, the value will be Current.

Note The default Grace Period is 30 days. If you changed the Grace Period in NPSP Settings, the

formula is adjusted accordingly.

When do Membership Values Roll Up?

The value of membership opportunity records rolls up to the related account or contact when certain

criteria are met.

11.. For new Membership records, all of the following must be true:

••

Amount field must a have a value ($0 is an acceptable value).

••

Opportunity Stage must be a Closed/Won type (Posted, or some other user-defined stage value that

has the Type set to Closed/Won).

22.. For updates to existing membership records, one of the following must be true:

••

The Stage must change from an Open or Closed/Lost stage type to a Closed/Won stage type.

••

The Amount value must change.

••

The Close Date must change.

••

The Account Name value must change.

Manage NPSP Programs

Program Management Module (PMM) is a simple program management tool designed to work in any

Salesforce environment. Use PMM to track your organization's programs and services, and follow the

journeys of the constituents involved with your programs.

Manage Your Programs with NPSP and Program Management Module (PMM)

Add Program Management Module (PMM) to NPSP to include program management in your

nonprofit's super-hero utility belt.

Manage Your Programs with NPSP and Program Management

Module (PMM)

Add Program Management Module (PMM) to NPSP to include program management in your nonprofit's

super-hero utility belt.

PMM is a simple program management tool designed to work in any Salesforce environment. Use PMM

to track your organization’s programs and services, and follow the journeys of the constituents involved

with your programs. PMM lets you define a standard unit of measurement for each of your services, so

you can track what you deliver to your constituents and understand how your programs are performing.

604



![Image](images/page_608_img_1.png)