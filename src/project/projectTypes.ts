export interface Category {
  id: string;
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  categoryId: string;
}

const CATEGORIES: Category[] = [
  {
    id: "cat1",
    title: "Education",
    description: "Education is the process of facilitating learning."
  },
  {
    id: "cat2",
    title: "Sustainability",
    description:
      "Sustainability is the ability to exist constantly. In the 21st century, it refers generally to the capacity for the biosphere and human civilization to coexist."
  }
];

const PROJECTS: Project[] = [
  {
    title: "Project 1",
    description: "This is project 1",
    image: "https://source.unsplash.com/random/300x200/?sig=1",
    id: "cem",
    categoryId: "cat1"
  },
  {
    title: "Project 2",
    description: "This is project 2",
    image: "https://source.unsplash.com/random/300x200/?sig=2",
    id: "2",
    categoryId: "cat1"
  },
  {
    title: "Project 3",
    description: "This is project 3",
    image: "https://source.unsplash.com/random/300x200/?sig=3",
    id: "3",
    categoryId: "cat2"
  }
];

export {CATEGORIES, PROJECTS};
