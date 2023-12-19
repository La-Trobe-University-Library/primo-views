# primo-views

## Description 
This repository holds the [Primo Customization Packages](https://knowledge.exlibrisgroup.com/Primo/Product_Documentation/Primo/Back_Office_Guide/090Primo_Utilities/The_UI_Customization_Package_Manager) for La Trobe University Library's Production and Sandbox systems.


## Structure
The repository contains two permanent branches:
- **production** holds the current files for the Primo Production system
- **sandbox** holds the current files for the Primo Sandbox system

Both branches store the extracted files (rather than the zipped-up packages) so we can use version comparison tools on them.

If you want to make changes, make a "work in progress" branch rather than editing the sandbox or production branches directly.


## Updating Files
1. Make a WIP branch from the **sandbox** branch
2. Make your changes. Test them in Sandbox. When they work...
3. Merge your WIP branch into the **sandbox** branch

We may be making multiple changes to Sandbox before we're ready to deploy them to Production.

When we're happy with the **sandbox** branch...
4. Deploy your changes to Primo Production
5. Merge the sandbox branch into the **production** branch


## Misc
### Copyright

Other than any prior works of which it is a derivative, the copyright in this work is owned by La Trobe University.

### Licenses

Rights of use and distribution are granted under the terms of the GNU Affero General Public License version 3 (AGPL-3.0). You should find a copy of this license in the root of the repository.

### Contact

The maintainer of this repository is Hugh Rundle, who can be contacted at h.rundle@latrobe.edu.au

