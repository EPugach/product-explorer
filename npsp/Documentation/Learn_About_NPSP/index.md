# Learn About NPSP

Learn about Nonprofit Success Pack, how to get started, next steps, and the NPSP planning guide.

## NPSP FAQ

Answers to common questions about NPSP, its limitations, and how it works for international

nonprofits.

## NPSP FAQ

Answers to common questions about NPSP, its limitations, and how it works for international nonprofits.

## General

Get answers about the basics of NPSP, how to get started, and how to troubleshoot issues.

## Limitations

Answers to questions about NPSP and person accounts, state and country picklists, and gift entry.

## International Nonprofits

Answers to questions about using NPSP outside of the US, with currency exchange rates, and in

context of particular national rules.

## General

Get answers about the basics of NPSP, how to get started, and how to troubleshoot issues.

### What is NPSP?

Nonprofit Success Pack (NPSP) is a series of managed packages, installed on top of Salesforce

Enterprise Edition. The packages of NPSP make it easier for you to use Salesforce to manage the core

relationships between individual donors, their households, and the companies they work for.

### Is Nonprofit Success Pack an Open Source Project?

Nonprofit Success Pack is an open-source, BSD-licensed package. Developer contributions and

involvement are welcome and encouraged.

### What's the best place to get started with NPSP?

Go to Trailhead to learn about NPSP and how you can use it to manage donors and donations. It's

interactive, informative, and fun.

### Where can I find documentation, discussions, and a place to make feature suggestions?

Start with the Trailblazer community and product documentation.

### Where can I find information on troubleshooting NPSP issues?

Check the troubleshooting section of NPSP documentation.

3



### What is NPSP?

Nonprofit Success Pack (NPSP) is a series of managed packages, installed on top of Salesforce Enterprise

Edition. The packages of NPSP make it easier for you to use Salesforce to manage the core relationships

between individual donors, their households, and the companies they work for.

You can install NPSP in one of the following ways:

•

Sign up for a trial version of NPSP (which gives you Salesforce Enterprise Edition with NPSP pre-

installed). This is the easiest way and is the method recommended by Salesforce.org.

•

Install NPSP on top of an already existing organization that uses Salesforce Enterprise Edition.

### Is Nonprofit Success Pack an Open Source Project?

Nonprofit Success Pack is an open-source, BSD-licensed package. Developer contributions and

involvement are welcome and encouraged.

Salesforce.org hosts all packages and source code on GitHub using git. You can find all code as well as

tags, issues lists, and release notes in the code repository. You can find contributor instructions on the

Salesforce.org GitHub wiki.

### What's the best place to get started with NPSP?

Go to Trailhead to learn about NPSP and how you can use it to manage donors and donations. It's

interactive, informative, and fun.

Start by completing the Begin with Nonprofit Success Pack trail.

### Where can I find documentation, discussions, and a place to make feature suggestions?

Start with the Trailblazer community and product documentation.

Visit our online Nonprofit Hub community for all of Salesforce's nonprofit organizations (whether or not

you use NPSP). There are discussion groups, links to learning materials, and much more. Your Salesforce

login will get you access.

Also, be sure to check out the NPSP documentation.

### Where can I find information on troubleshooting NPSP issues?

Check the troubleshooting section of NPSP documentation.

We've compiled a list of common issues in Troubleshoot the Nonprofit Success Pack.

4



## Limitations

Answers to questions about NPSP and person accounts, state and country picklists, and gift entry.

### NPSP and Person Accounts

Person accounts were designed for Business-to-Business organizations that work with individuals.

Person accounts were not built to work with Nonprofit Success Pack and therefore, are not supported

for use with NPSP.

### State and Country Picklists

State and Country Picklists let users select states and countries from predefined, standardized lists,

instead of entering state and country data into text fields. State and Country Picklists help protect data

integrity by preventing typos, alternate spellings, and junk data.

### Statement on Batch Data Entry and Legacy Batch Gift Entry

As of October 1, 2020, Batch Data Entry, is no longer supported, and as of July 13, 2021, legacy Batch

Gift Entry is no longer supported. If you have any in-progress batches, you can still access those

records, but you can't process them using these retired tools. Consider Gift Entry as an alternative to

Batch Data Entry and legacy Batch Gift Entry.

### NPSP and Person Accounts

Person accounts were designed for Business-to-Business organizations that work with individuals. Person

accounts were not built to work with Nonprofit Success Pack and therefore, are not supported for use

with NPSP.

If Person Accounts are not already enabled in your org, don't enable them. Once you turn on Person

Accounts in your organization, you can't turn the feature off. To completely remove Person Accounts, you

need to apply for a new Salesforce organization and request a license transfer. You will then need to

migrate existing data from your current system to the new Salesforce org. Ask your Account Executive for

help with this process.

For some orgs, turning Person Accounts off isn't an option. While NPSP and Person Accounts don't work

together, here are some things you can do to help them coexist:

•

Make sure that the Person Account record type is not selected as the Household record type in NPSP

Settings

•

If you're planning to do lead conversion, make sure that the Person Account record type isn't set as the

default record type for the profile of the user who is converting the lead.

### State and Country Picklists

State and Country Picklists let users select states and countries from predefined, standardized lists,

instead of entering state and country data into text fields. State and Country Picklists help protect data

integrity by preventing typos, alternate spellings, and junk data.

See Let Users Select State and Country from Picklists to learn how to set up and configure this feature.

5



Nonprofit Success Pack (NPSP) supports State and Country Picklists with some limitations:

11.. Does not support default Country value. Configuring a default Country value can cause an error if

you select a Country that isn't the default.

22.. Must use predefined State and Country abbreviations on Address records. On Address records, use

the same abbreviations for State and Country as defined in the State and Country Picklists

configuration. NPSP will write the full name of the State and Country on related Accounts and

Contacts. For example, if you use both US and WA on the Address record you get United States and

Washington on the Account and Contact records. If you use alternate spellings, NPSP will display an

error.

33.. Does not support State and Country abbreviations on Manage Households page and Data Import

object. On the Manage Households page and the Data Import object, use only the full name of State

and Country. There is no support for abbreviations.

44.. Does not support State and Country abbreviations in Gift Entry. All state and province codes are

displayed without the dependency to their countries.

### Statement on Batch Data Entry and Legacy Batch Gift Entry

As of October 1, 2020, Batch Data Entry, is no longer supported, and as of July 13, 2021, legacy Batch

Gift Entry is no longer supported. If you have any in-progress batches, you can still access those records,

but you can't process them using these retired tools. Consider Gift Entry as an alternative to Batch Data

Entry and legacy Batch Gift Entry.

Learn more in Configure Gift Entry. Gift Entry is an NPSP feature that gives users an accurate, fast, and

flexible way to enter batch and single gifts. It's designed to help users who struggle to enter large

volumes of gifts in a consistent way and spend too much time ensuring that complex gifts have the right

attributions.

•

Enter the full gift details on one form instead of creating an Opportunity and then adding related

information such as Payments and GAU Allocations. Learn more in Enter Gifts in Gift Entry.

•

Set up different Gift Entry Templates so your users have the fields they need when entering different

types of gifts. Learn more in Create or Edit a Gift Entry Template.

•

Set a field as required when you add it to a template.

•

Define field defaults at the template level or within each batch of gifts.

We're continuously building on and enhancing Gift Entry and NPSP Data Importer. Let us know how

these tools are working for you in the Data Import and Gift Entry Trailblazer Community groups.

## International Nonprofits

Answers to questions about using NPSP outside of the US, with currency exchange rates, and in context

of particular national rules.

### Can I use NPSP in countries outside the U.S.?

Salesforce supports many languages and currencies. There are a few details to be aware of though.

6



Currently, if a user sets their language to something other than English, all of Salesforce will appear in

that language except for custom fields and NPSP-specific fields, buttons, etc.

### So, can I use dated exchange rates?

You can use dated exchange rates within Advanced Currency Management (ACM), but only with

Customizable Rollups. Legacy NPSP rollups will continue to use the default exchange rate by currency

even if ACM is enabled.

### Does NPSP support Gift Aid (UK)?

At this time there is not native functionality to support Gift Aid in the UK. However, some Salesforce

partners in the UK have developed apps to handle Gift Aid.

### Does NPSP support SEPA?

Single Euro Payment Area (SEPA) refers to electronic payment processing in the European Union. At

this time NPSP does not have on-platform payment processing, so it does not support SEPA.

### Does NPSP support Canadian tax receipts?

Out of the box, NPSP does not have functionality to address Canadian receipts. There are, however,

customizations built by a variety of providers.

### Can I use NPSP in countries outside the U.S.?

Salesforce supports many languages and currencies. There are a few details to be aware of though.

Currently, if a user sets their language to something other than English, all of Salesforce will appear in

that language except for custom fields and NPSP-specific fields, buttons, etc.

The Nonprofit Success Pack provides out-of-the-box translations for Spanish, French, German, Japanese,

and Dutch. Portions of NPSP are also translated for Hebrew. This does not mean that a customer or

partner could not translate all the fields, but it would be time-consuming. There may be consulting firms

or partners in other countries who have done translations for other languages, but they are not included

in the standard NPSP configuration at this time. If you're planning to translate on your own, please read

Nonprofit Success Pack and Translation first, as there are some areas of NPSP that can't be translated.

Users in countries outside the U.S. are able to set their default currency as something other than USD

without a problem. Users can also enable multi-currency (MC) to allow entry of Opportunities (and any

currency field) to display the currency of the org or the local currency of the user. This option only

supports a single one time rate.

Additionally, Advanced Currency Management (ACM) is supported for use with NPSP as of May 2018

(version 3.129). But please keep in mind that dated exchange rates will only work with your rollups if you

enable Customizable Rollups ; dated exchange rates aren't supported for use with legacy NPSP rollups.

There are also a few important limitations to note if you decide to use ACM with NPSP:

•

If you have ACM enabled and experience issues trying to install or upgrade NPSP, or find that your

version of NPSP has fallen behind current, the ACM integration may be the issue. We recommend

temporarily disabling ACM and manually installing the latest NPSP package. You will not lose any ACM

configurations that you set up while ACM was enabled; when you turn ACM back on, everything will go

back to the way it was working before you disabled. We recommend you do this during off hours when

you don’t need to process transactions.

7