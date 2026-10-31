# Gotails Admin Panel — Mandatory Project Structure Cleanup

The previous instruction to remove the `Stitch Designs` folder and organize the project structure professionally has not been completed.

I want you to complete these tasks now. Do not skip them, postpone them, or simply provide recommendations.

**This is an implementation task. You must make the actual changes directly in the existing project.**

## 1. Completely Remove the Stitch Designs Folder

Locate the folder named `Stitch Designs` in the project directory.

- Delete the entire `Stitch Designs` folder.
- Delete all HTML files and other design-reference files contained inside it.
- Do not keep the folder under a different name.
- Do not move these HTML files into another project folder.
- Check for references to these files in the React application and remove obsolete references if found.

The final project must not contain the `Stitch Designs` folder or its unused HTML design files.

## 2. Reorganize the Entire React Project Structure

The current project structure needs to be cleaned up and reorganized into a professional, maintainable React application architecture.

First, inspect the entire existing project, including all files and folders. Identify:

- React pages and screens.
- Reusable UI components.
- Layout components.
- Application routes.
- Images, icons, and other assets.
- Stylesheets and styling resources.
- Hooks and utility functions.
- Configuration files.
- Unused, duplicate, temporary, and obsolete files.

Then reorganize them logically.

Use a professional structure similar to the following, adapting it to the actual project requirements:

```text
gotails-admin-panel/
│
├── public/
│   └── assets/
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── pages/
│   │   ├── Dashboard/
│   │   ├── MasterCatalog/
│   │   ├── Sellers/
│   │   ├── Customers/
│   │   └── SellerApprovals/
│   │
│   ├── routes/
│   │
│   ├── hooks/
│   │
│   ├── utils/
│   │
│   ├── styles/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── other-required-configuration-files
```

This is a structural reference, not a requirement to create empty folders. Only create folders that are actually needed by the application.

## 3. Important Rules While Reorganizing

- Move existing files into appropriate folders instead of creating duplicate versions.
- Keep reusable components separate from individual page components.
- Keep page-specific components organized with their respective pages where appropriate.
- Keep assets and stylesheets organized.
- Remove unused and duplicate files.
- Remove unnecessary folders.
- Maintain clear and consistent naming conventions.
- Keep configuration files at appropriate locations.
- Do not create unnecessary files or folders.
- Do not modify existing UI designs or functionality during this cleanup.

## 4. Preserve the Existing Technology and Functionality

- Continue using React for the entire frontend.
- Continue using Watermelon UI as the UI component library.
- Do not introduce another frontend framework or UI library.
- Do not create or configure a backend.
- Do not add database or API integrations.

After reorganizing, update all affected import paths, component references, asset paths, and route references.

## 5. Mandatory Final Verification

After completing the work, you must:

1. Confirm that the `Stitch Designs` folder has been physically deleted.
2. Confirm that its HTML design files are no longer present in the project.
3. Confirm that the React application follows the reorganized folder structure.
4. Verify that there are no broken imports or missing assets.
5. Verify that all existing pages and navigation continue to work.
6. Run the application and resolve any build or runtime errors.

## 6. Final Completion Report

Once the actual changes are completed, provide:

- Confirmation that the `Stitch Designs` folder was deleted.
- The final updated project folder structure.
- A list of important files and folders that were reorganized.
- A list of unused files or folders that were removed.
- Confirmation that the React application builds and runs successfully.

**FINAL INSTRUCTION: Do not just explain how the project should be organized. Actually inspect, delete, move, reorganize, update, and verify the files in the existing project. Do not consider this task complete until the `Stitch Designs` folder is gone and the project structure has been cleaned up.**