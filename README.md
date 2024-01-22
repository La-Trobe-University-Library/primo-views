# primo-views

## Description 
This repository holds the [Primo Customization Packages](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/Primo/Back_Office_Guide/090Primo_Utilities/The_UI_Customization_Package_Manager) for La Trobe University Library's Production and Sandbox systems.

The repository contains two permanent branches:

- **production** holds the current files for the Primo Production system
- **sandbox** holds the current files for the Primo Sandbox system

Both branches store the extracted files (rather than the zipped-up packages) so we can use version comparison tools on them.


## Updating Files

If you want to make changes, make a "work in progress" branch rather than editing the sandbox or production branches directly.

1. Make a WIP branch from the **sandbox** branch
2. Make your changes. Test them in Sandbox. When they work...
3. Merge your WIP branch into the **sandbox** branch

We may be making multiple changes to Sandbox before we're ready to deploy them to Production.

When we're happy with the **sandbox** branch...
1. Deploy your changes to Primo Production
2. Merge the sandbox branch into the **production** branch. DO NOT DELETE THE SANBOX BRANCH!


### Detailed instructions
1. Preparation
    1. Create your own GitHub account to access repositories
    2. Install GitHub Desktop

2. Create your work-in-progress fork:
    1. You need to be logged into your github account to create a fork
    2. Click on the fork button on on the main page of the repository
    3. Leave name and description and untick 'Production' branch only
    4. Click **Create fork**
    
3. Open your fork in GitHub Desktop
    1. Go to **File** > **Clone repository**
    2. Choose *username*/primo-views
    3. Click **Clone repository**
    4. Choose **To contribute to the parent project** and click **Continue**
    5. Click **Fetch origin**

4. Make your changes 
    1. Set **Current branch** to your WIP branch
    2. Click **Show in Explorer** to see your files.
    3. Edit your files. Zip them. Deploy to Primo. Test them. 
    4. When they work...

5. Save your changes
    1. Save and commit any changes to your local fork: Changes side tab > Commit to <branchname>
    2. Push your local commits to the remote repository: Push origin
    3. Publish your current branch to GitHub.

6. Merge your changes into the original branch
    1. Create a pull request
    2. Invite reviewers
    3. Address their review comments
    4. Merge your pull request

7. Delete your branch from both GitHub and your local machine


## Misc

### Copyright

Other than any prior works of which it is a derivative, the copyright in this work is owned by La Trobe University.

### Licenses

Rights of use and distribution are granted under the terms of the GNU Affero General Public License version 3 (AGPL-3.0). You should find a copy of this license in the root of the repository.

### Contact

The maintainer of this repository is Hugh Rundle, who can be contacted at h.rundle@latrobe.edu.au

