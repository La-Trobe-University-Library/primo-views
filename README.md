# primo-views

## Description 
This repository holds the [Primo Customization Packages](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/Primo/Back_Office_Guide/090Primo_Utilities/The_UI_Customization_Package_Manager) for La Trobe University Library's Production and Sandbox systems.

The repository contains one permanent branch, `production`, which holds the current files for the LTU production Primo interface. This repository stores the extracted files (rather than the zipped-up packages) so we can use version comparison tools.


## Updating Files

All changes to Primo configuration files need to be tested in the Primo Sandbox before they are deployed to Production.

- make a fork of the **primo-views** repository, or check that your existing fork is up to date
- create a new branch in your fork to work on your changes
- make all your changes in the new local branch
- test on the Primo sandbox server
- gain approval
- deploy the changes to Primo Production
- create a PR to merge the changes from your branch into `production` on the upstream repository
- a repository owner will pull your changes into `production` in this main repository: the code now once again matches what is deployed to our production server

### Detailed instructions
1. Preparation
    1. Create your own GitHub account to access repositories
    2. Install GitHub Desktop

2. Create your work-in-progress fork - a.k.a. [origin repository](https://git-for-librarians.netlify.app/forking#origin-and-upstream-repository):
    1. You need to be logged into your github account to create a fork
    2. Click on the fork button on on the main page of the repository
    3. Click **Create fork**
    
3. Open your fork in GitHub Desktop
    1. Go to **File** > **Clone repository**
    2. Choose *username*/primo-views
    3. Click **Clone repository**
    4. Choose **To contribute to the parent project** and click **Continue**
    5. Click **Fetch origin**

4. Make your changes 
    1. In **Current branch** create **new branch**
    2. Click **Show in Explorer** to see your files.
    3. Edit your files. Zip them. Deploy to sandbox Primo. Test them. 
    4. When they work...

5. Save your changes
    1. Save and commit any changes to your local fork: Changes side tab
	2. Add description of changes
	3. Commit to your branch
    4. Push commits to your fork's remote: Click **Push origin**
    
6. Create a pull request to the upstream repository
    1. Go to the main page of your origin repository in GitHub website
	2. Click **Sync fork**
	3. Click **Contribute** > **Open pull request**
    4. Click **Create pull request**
	5. Add a title briefly describing the change
	6. Add a description with more detail if needed
	7. Click **Create pull request** to send to upstream repository owner to authorise

7. The La-Trobe-University-Library owner will then merge your pull request into the upstream repository

## Misc

### Copyright

Other than any prior works of which it is a derivative, the copyright in this work is owned by La Trobe University.

### Licenses

Rights of use and distribution are granted under the terms of the GNU Affero General Public License version 3 (AGPL-3.0). You should find a copy of this license in the root of the repository.

### Contact

The maintainer of this repository is Hugh Rundle, who can be contacted at h.rundle@latrobe.edu.au

