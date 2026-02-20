





•

There are four Opportunity fields that don't work when ACM is enabled: Payment Writeoff Amount,

Number of Payments, Payments Made, Remaining Balance.

SSoo,, ccaann II uussee ddaatteedd eexxcchhaannggee rraatteess??

You can use dated exchange rates within Advanced Currency Management (ACM), but only with

Customizable Rollups. Legacy NPSP rollups will continue to use the default exchange rate by currency

even if ACM is enabled.

Dated exchange rates are described in more detail here.

Once you enable Customizable Rollups , go to Setup and turn on Advanced Currency Management. You

then need to go to NPSP Settings and indicate that you want to use dated exchange rates by setting the

Use Dated Conversion Rates if available checkbox in NPSP Settings | Bulk Data Processes | Batch

Process Settings.

Note Please note that we currently have no way of knowing if Advanced Currency Management is

enabled and then disabled. So, even if you disable ACM, certain areas of NPSP code will function as

if you have Advanced Currency Management enabled. This is due to a Salesforce Known Issue. For

more information on how this affects NPSP, see Issue #4450 on GitHub.

DDooeess NNPPSSPP ssuuppppoorrtt GGiifftt AAiidd ((UUKK))??

At this time there is not native functionality to support Gift Aid in the UK. However, some Salesforce

partners in the UK have developed apps to handle Gift Aid.

Follow the Nonprofit User Group, London, UK to learn more about these options.

DDooeess NNPPSSPP ssuuppppoorrtt SSEEPPAA??

Single Euro Payment Area (SEPA) refers to electronic payment processing in the European Union. At this

time NPSP does not have on-platform payment processing, so it does not support SEPA.

However, any payment processor or donation/giving platform that supports SEPA could conceivably

integrate with NPSP.

DDooeess NNPPSSPP ssuuppppoorrtt CCaannaaddiiaann ttaaxx rreecceeiippttss??

Out of the box, NPSP does not have functionality to address Canadian receipts. There are, however,

customizations built by a variety of providers.

Search the Trailblazer Community for further details.

8



![Image](images/page_12_img_1.png)







# Get Started with Salesforce for Nonprofits

Before you dig into your Salesforce trial, get acquainted with Salesforce terminology, your product(s), and

the basics of using Salesforce.

There are many ways to learn about Salesforce. How you approach it depends on your learning style and

preferences. Want to learn online on your own time? Try Trailhead. Want to read through detailed

documentation, get one-on-one assistance, or talk to your peers? We've got you covered on all fronts!

We have an amazing collection of resources below designed to help you get started and be successful

with Salesforce. Follow along with these three easy steps to get started.

## Step 1: Learn About Salesforce for Nonprofits and Salesforce Licensing

Start with basic details about Salesforce for Nonprofits, Salesforce editions, and products like

Nonprofit Success Pack (NPSP) and Program Management Module (PMM).

## Step 2: Understand Where to Get Help

You aren't alone in your journey with Salesforce for Nonprofits. Learn about Success Plans and our

active, vibrant community of Trailblazers like you.

## Step 3: Begin Your Nonprofit Learning Journey

Grow your knowledge of Salesforce for Nonprofits through learning paths and live events.

## Step 1: Learn About Salesforce for Nonprofits and Salesforce Licensing

Start with basic details about Salesforce for Nonprofits, Salesforce editions, and products like Nonprofit

Success Pack (NPSP) and Program Management Module (PMM).

Meet Salesforce for Nonprofits

At Salesforce we empower mission-based organizations with the technology needed to connect with

donors, track volunteers, manage campaigns, support clients, and manage nearly everything else they

need to do to succeed. We call this set of solutions and purpose-built products Salesforce for

Nonprofits

Understanding Salesforce Editions and Products

A Salesforce edition is a selected set of features and functionality that also specifies the amount of

customization possible, as well as the data and file storage capacity, and access to application

programming interfaces (APIs).

Nonprofit Success Pack (NPSP) and Program Management Module (PMM)

Typically, nonprofit Salesforce customers select Enterprise Edition (EE) and use one or more prebuilt

apps to manage their business processes. NPSP and PMM are two popular options.

### Meet Salesforce for Nonprofits

At Salesforce we empower mission-based organizations with the technology needed to connect with

donors, track volunteers, manage campaigns, support clients, and manage nearly everything else they

need to do to succeed. We call this set of solutions and purpose-built products Salesforce for Nonprofits

9





Salesforce for Nonprofits includes apps, tools, features, services, and technology that can meet the

unique needs of nonprofits. This includes the latest innovation from the Salesforce platform, including

robust artificial intelligence (AI), analytics, and integration capabilities. This combination empowers

organizations to go from siloed data to actionable insights, transforming constituent engagements into

lifelong relationships.

### Understanding Salesforce Editions and Products

A Salesforce edition is a selected set of features and functionality that also specifies the amount of

customization possible, as well as the data and file storage capacity, and access to application

programming interfaces (APIs).

With the Power of Us license donation program, Salesforce.org customers can sign up for 10 Enterprise

Edition (EE) licenses at no cost. A license is attached to a single user, so with 10 licenses, you can have 10

users logged in to your Salesforce org at one time. If you need additional licenses or products, you can

purchase them at a deep discount by logging in and managing your subscriptions. As you review

Salesforce documentation, log a Customer Support ticket, or ask for help from the community, it's vital

to know the edition you're using. (While we strongly recommend Enterprise Edition for most

organizations, you can learn about the other editions here.)

### Nonprofit Success Pack (NPSP) and Program Management Module (PMM)

Typically, nonprofit Salesforce customers select Enterprise Edition (EE) and use one or more prebuilt apps

to manage their business processes. NPSP and PMM are two popular options.

NPSP is the foundation of Salesforce for Nonprofits. It provides a common data model that supports the

entire constituent journey, including donation management, seasonal address management, campaign

management, and preconfigured reports and dashboards. Developed in collaboration with our partners

and customer community, NPSP is entirely customizable, speeding up the time to a connected nonprofit

and paving the way for continuous innovation. NPSP comes pre-installed with your trial.

PMM is built to help mission-driven organizations connect people, processes, and data. With prebuilt

custom objects, page layouts, automation, customizable reports and dashboards, and easily integrated

third-party apps, PMM provides organizations with a 360-degree view of their constituents and their

program activities. Program Management Module works best when installed alongside NPSP .

## Step 2: Understand Where to Get Help

You aren't alone in your journey with Salesforce for Nonprofits. Learn about Success Plans and our active,

vibrant community of Trailblazers like you.

Your Success Team

Every Salesforce.org customer has access to a Standard Success Plan from Salesforce that includes self-

guided resources to get you started.

Join the Community

Visit our online community for Salesforce nonprofit customers, certified partners, and staff. This is a

10





place for you to get answers, build your Salesforce skills, share your expertise, and connect with other

mission-driven organizations that use Salesforce!

Trailblazer Community

The Trailblazer Community connects Salesforce communities from all sectors. Join to participate in

general product discussions and to connect with your local community group.

### Your Success Team

Every Salesforce.org customer has access to a Standard Success Plan from Salesforce that includes self-

guided resources to get you started.

You also get access to community-based best practices and web-based support to help How to Create a

Case on Salesforce Help.

If your organization is ready for enhanced support, resources, and training to drive adoption, then you

can purchase a Premier Success Plan which is available at a deep discount to Salesforce.org customers. If

you are interested in pricing for Premier Success, reach out to us via the Contact Me form.

### Join the Community

Visit our online community for Salesforce nonprofit customers, certified partners, and staff. This is a

place for you to get answers, build your Salesforce skills, share your expertise, and connect with other

mission-driven organizations that use Salesforce!

Here are some useful groups to join.

•

Salesforce.org Get Started Hub for best practices, resources, and to connect with other users who are

just getting started

•

Nonprofit Success Pack (NPSP) for questions, discussions, and best practices for organizations using

NPSP

•

Nonprofit Release Readiness for broadcast only announcements about product updates and releases

•

Nonprofit and Education Mindshare for keeping up with articles and events from Salesforce.org staff

and our community

### Trailblazer Community

The Trailblazer Community connects Salesforce communities from all sectors. Join to participate in

general product discussions and to connect with your local community group.

Check out these groups to get started.

•

Nonprofits Using Salesforce for organizations who are not current Salesforce.org customers but have

questions about NPSP, PMM, or other apps

•

ANZ Nonprofit Customers specifically for organizations based in Australia or New Zealand

11





## Step 3: Begin Your Nonprofit Learning Journey

Grow your knowledge of Salesforce for Nonprofits through learning paths and live events.

Learning Paths

Our learning paths are an amazing collection of resources designed to help you get started and be

successful with Salesforce for Nonprofits. We've organized multiple learning paths around your work.

Check out our paths for Fundraising, Program Management, Constituent Engagement, and Analytics.

Attend a Live Event

Join a live online session to gain new insights or ask an expert for answers to your questions.

### Learning Paths

Our learning paths are an amazing collection of resources designed to help you get started and be

successful with Salesforce for Nonprofits. We've organized multiple learning paths around your work.

Check out our paths for Fundraising, Program Management, Constituent Engagement, and Analytics.

Each step of the journey contains resources (videos, Trailhead, documentation, and more) to get you up-

to-speed quickly with how to use Salesforce technology. Choose your path and start learning!

### Attend a Live Event

Join a live online session to gain new insights or ask an expert for answers to your questions.

Visit the Customer Success Events calendar and filter by your language or region to stay in the loop on

the latest events and webinars from Salesforce Customer Success. This is also where you will find our

video library.