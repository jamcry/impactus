import {CATEGORIES, Category, PROJECTS, Project} from "./projectTypes";

function getProjectCategory(project: Project) {
  return CATEGORIES.find((category) => category.id === project.categoryId);
}

function getProjectsInCategory(categoryId: Category["id"]) {
  return PROJECTS.filter((project) => project.categoryId === categoryId);
}

export {getProjectCategory, getProjectsInCategory};
