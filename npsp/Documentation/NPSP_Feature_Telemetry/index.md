# NPSP Feature Telemetry

NPSP Feature Telemetry collects feature and usage metrics when customers use our products. This

information provides Salesforce.org with valuable insight into how NPSP is used by our customers. We

use this information to understand the level of usage, performance, and adoption of various NPSP

features.

No personally identifiable information is collected through NPSP Feature Telemetry.

We use this data to compile metrics about feature enablement, component enablement, record counts,

page load time, Apex code execution, and more.

We currently collect the following data points.

15





System Settings

•

Is the Household Account Model enabled

•

Is Customizable Rollups enabled

•

Is Automatic Payments enabled

•

Is Default GAU enabled

•

Is Advanced Mapping enabled

•

Is Address Verification enabled

•

Is Advanced Currency Management in use

•

Is Gift Entry enabled

•

Count of Non-English Languages in use

•

Is Enhanced Recurring Donations enabled

•

Is Payment Allocations enabled (Payment Allocations is available for GEM users and isn't yet supported

for use in other NPSP production orgs.)

Donations

•

Count of all Recurring Donation related Opportunities

•

Count of all Open-Ended Recurring Donation related Opportunities

•

Count of Recurring Donations with at least one Opportunity where the amount differs from the

Recurring Donation amount

•

Count of all Recurring Donations

•

Enhanced Recurring Donations upgrade status (recorded as a number indicating not upgraded,

partially upgraded, or fully upgraded)

•

Count of NPSP Data Import records attached to Batch Gift Entry batches within the last 30 days

•

Count of NPSP Data Import records attached to Gift Entry batches within the last 30 days

•

Count of Opportunities with Multiple Payments

•

Maximum Number of Opportunities associated with a single Account

System Performance

•

Count of NPSP Data Import records created within the last 30 days

•

Count of NPSP Error Log Records

•

Count of NPSP batch jobs that failed with a TIME_OUT error within the last 7 days

•

Count (in minutes) of the NPSP batch job with the longest execution time within the last 7 days

•

Are Custom TDTM Trigger Handlers in use

Note Data about whether Customizable Rollups are enabled is collected when you enable or disable

Customizable Rollups in NPSP Settings.

To give you a better picture of what the data looks like, here’s a sample telemetry record:

16



![Image](images/page_20_img_1.png)





![Image](images/page_20_img_2.png)